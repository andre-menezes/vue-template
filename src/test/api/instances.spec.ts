import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { ofetch, type FetchOptions } from 'ofetch';
import {
  API_BASE_URL,
  APP_MODULO,
  AUTH_BACKEND_URL,
  CSRF_HEADER_NAME,
  HTTP_TIMEOUT_MS,
  MODULO_HEADER_NAME,
} from '@core/config';
import { authBackend, httpClient } from '@shared/api/instances';

interface FakeInstance {
  options: FetchOptions;
  fetch: Mock;
  raw: Mock;
}

const { handleAuthError, getCookie, instances } = vi.hoisted(() => ({
  handleAuthError: vi.fn(),
  getCookie: vi.fn(),
  instances: new Map<string, FakeInstance>(),
}));

vi.mock('@shared/api/instances/auth-error', () => ({ handleAuthError }));
vi.mock('@shared/utils/cookie', () => ({ getCookie }));

// Captura cada `ofetch.create` (uma instância por base URL) sem rede real.
vi.mock('ofetch', () => ({
  ofetch: {
    create: vi.fn((options: FetchOptions) => {
      const raw = vi.fn();
      const fetch = Object.assign(vi.fn().mockResolvedValue({ ok: true }), { raw });
      instances.set(options.baseURL as string, { options, fetch, raw });
      return fetch;
    }),
  },
}));

type RequestHook = (context: { options: { method?: string; headers: Headers } }) => void;
type ResponseErrorHook = (context: { response: { status: number; _data: unknown } }) => void;

function instanceFor(baseURL: string): FakeInstance {
  const instance = instances.get(baseURL);
  if (!instance) throw new Error(`Instância não criada para ${baseURL}`);
  return instance;
}

/** Opções recebidas pelo ofetch na última chamada da instância. */
function lastCallOptions(mock: Mock): FetchOptions {
  return mock.mock.lastCall?.[1] as FetchOptions;
}

function runOnRequest(method: string): Headers {
  const options = { method, headers: new Headers({ Accept: 'application/json' }) };
  (instanceFor(API_BASE_URL).options.onRequest as RequestHook)({ options });
  return options.headers;
}

describe('instâncias HTTP', () => {
  beforeEach(() => {
    handleAuthError.mockClear();
    getCookie.mockReset();
    instances.forEach(({ fetch, raw }) => {
      fetch.mockClear();
      raw.mockReset();
    });
  });

  it('cria uma única instância do ofetch por base URL, reutilizada nas chamadas', async () => {
    const created = vi.mocked(ofetch.create).mock.calls.length;

    await httpClient.get('/clientes');
    await httpClient.post('/clientes', { body: { nome: 'Ana' } });
    await httpClient.delete('/clientes/1');

    expect(vi.mocked(ofetch.create).mock.calls.length).toBe(created);
    expect([...instances.keys()].sort()).toEqual([API_BASE_URL, AUTH_BACKEND_URL].sort());
    expect(instanceFor(API_BASE_URL).fetch).toHaveBeenCalledTimes(3);
  });

  it('repassa método, query e headers da chamada, com o timeout padrão', async () => {
    interface ClienteFiltro {
      nome?: string;
      pagina: number;
    }
    const query: ClienteFiltro = { nome: 'Ana', pagina: 2 };

    await httpClient.get<unknown, ClienteFiltro>('/clientes', {
      query,
      headers: { 'Accept-Language': 'pt-BR' },
    });

    const { fetch } = instanceFor(API_BASE_URL);
    expect(fetch).toHaveBeenCalledWith('/clientes', {
      method: 'GET',
      query,
      body: undefined,
      headers: { 'Accept-Language': 'pt-BR' },
      timeout: HTTP_TIMEOUT_MS,
    });
  });

  it('envia o corpo nas requisições mutantes', async () => {
    await httpClient.put('/clientes/1', { body: { nome: 'Ana' } });

    expect(lastCallOptions(instanceFor(API_BASE_URL).fetch)).toMatchObject({
      method: 'PUT',
      body: { nome: 'Ana' },
    });
  });

  it('combina o signal da chamada com o timeout (cancelar a chamada aborta a requisição)', async () => {
    const controller = new AbortController();

    await httpClient.get('/clientes', { signal: controller.signal });

    const options = lastCallOptions(instanceFor(API_BASE_URL).fetch);
    expect(options.timeout).toBeUndefined();
    expect(options.signal?.aborted).toBe(false);

    controller.abort();
    expect(options.signal?.aborted).toBe(true);
  });

  it('identifica o módulo em toda requisição e só envia o CSRF nas mutantes', () => {
    getCookie.mockReturnValue('token-csrf');

    const get = runOnRequest('GET');
    expect(get.get(MODULO_HEADER_NAME)).toBe(APP_MODULO);
    expect(get.get(CSRF_HEADER_NAME)).toBeNull();
    expect(get.get('Accept')).toBe('application/json');

    for (const method of ['POST', 'put', 'PATCH', 'DELETE']) {
      expect(runOnRequest(method).get(CSRF_HEADER_NAME)).toBe('token-csrf');
    }
  });

  it('não envia header CSRF quando o cookie não existe', () => {
    getCookie.mockReturnValue(undefined);

    expect(runOnRequest('POST').get(CSRF_HEADER_NAME)).toBeNull();
  });

  it('baixa arquivo devolvendo o blob e o Content-Disposition', async () => {
    const blob = new Blob(['pdf']);
    instanceFor(API_BASE_URL).raw.mockResolvedValue({
      _data: blob,
      headers: new Headers({ 'content-disposition': 'attachment; filename="r.pdf"' }),
    });

    const result = await httpClient.download('/reports/1/pdf', { query: { versao: 2 } });

    expect(result).toEqual({ blob, contentDisposition: 'attachment; filename="r.pdf"' });
    expect(lastCallOptions(instanceFor(API_BASE_URL).raw)).toMatchObject({
      method: 'GET',
      query: { versao: 2 },
      responseType: 'blob',
    });
  });

  it('falha o download quando a resposta não traz conteúdo binário', async () => {
    instanceFor(API_BASE_URL).raw.mockResolvedValue({ _data: undefined, headers: new Headers() });

    await expect(httpClient.download('/reports/1/pdf')).rejects.toThrow(
      'Download sem conteúdo binário'
    );
  });
});

describe('instâncias HTTP — tratamento global de 401 (ADR-0017)', () => {
  beforeEach(() => {
    handleAuthError.mockClear();
  });

  function triggerResponseError(baseURL: string, status: number): void {
    (instanceFor(baseURL).options.onResponseError as ResponseErrorHook)({
      response: { status, _data: undefined },
    });
  }

  it('httpClient aplica o tratamento global de erros de autenticação', () => {
    triggerResponseError(API_BASE_URL, 401);

    expect(handleAuthError).toHaveBeenCalledWith(401, undefined);
  });

  it('authBackend não dispara o login global (o guard trata o erro)', async () => {
    await authBackend.get('/authorization/user');
    triggerResponseError(AUTH_BACKEND_URL, 401);

    expect(handleAuthError).not.toHaveBeenCalled();
  });
});
