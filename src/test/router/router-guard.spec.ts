import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import type { RouteLocationNormalized } from 'vue-router';
import { beforeResolveGuard } from '@app/providers/router';
import { getTokenRequest, getUserDataRequest } from '@shared/api/services/auth.service';
import { startLogin } from '@shared/helpers/session';
import { criarState } from '@core/auth/state';
import { useUserStore } from '@shared/stores/user.store';

vi.mock('@shared/api/services/auth.service', () => ({
  getTokenRequest: vi.fn(),
  getUserDataRequest: vi.fn(),
}));

vi.mock('@shared/helpers/session', () => ({
  startLogin: vi.fn(),
}));

const userData = {
  nome: 'Maria Silva',
  email: ['maria@example.com'],
  login: '12345678900',
  unidade: { id: 1, nome: 'Unidade Central', codigo: '001' },
  roles: ['ARCH_PRODEMGE' as const],
  temMultiplasUnidades: false,
};

function createRoute(
  path: string,
  requiresAuth: boolean,
  query: Record<string, string> = {}
): RouteLocationNormalized {
  return {
    path,
    fullPath: path,
    query,
    meta: { requiresAuth },
  } as unknown as RouteLocationNormalized;
}

describe('beforeResolveGuard', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('bloqueia rota protegida sem sessão e guarda o destino original', async () => {
    // Sem cookie válido, o backend nega os dados do usuário (ex.: 401).
    vi.mocked(getUserDataRequest).mockRejectedValue(new Error('Unauthorized'));

    const result = await beforeResolveGuard(
      createRoute('/exemplo-protegido', true),
      createRoute('/', false)
    );

    expect(result).toBe(false);
    expect(sessionStorage.getItem('redirect_after_login')).toBe('/exemplo-protegido');
    expect(startLogin).toHaveBeenCalledOnce();
  });

  it('carrega o usuário via backend e autoriza a aplicação', async () => {
    const userStore = useUserStore();
    vi.mocked(getUserDataRequest).mockResolvedValue(userData);

    const result = await beforeResolveGuard(
      createRoute('/exemplo-protegido', true),
      createRoute('/', false)
    );

    expect(result).toBeUndefined();
    expect(getUserDataRequest).toHaveBeenCalledOnce();
    expect(userStore.userData).toEqual(userData);
    expect(userStore.isAuthorized).toBe(true);
  });

  it('não reconsulta o backend quando o usuário já está carregado', async () => {
    const userStore = useUserStore();
    userStore.setUserData(userData);

    const result = await beforeResolveGuard(
      createRoute('/exemplo-protegido', true),
      createRoute('/', false)
    );

    expect(result).toBeUndefined();
    expect(getUserDataRequest).not.toHaveBeenCalled();
  });

  it('processa o code do SSC, carrega o usuário e retorna ao destino salvo', async () => {
    // Login BFF: o backend responde 204 e emite os cookies (sem corpo).
    vi.mocked(getTokenRequest).mockResolvedValue(undefined);
    vi.mocked(getUserDataRequest).mockResolvedValue(userData);
    sessionStorage.setItem('redirect_after_login', '/exemplo-protegido');
    const state = decodeURIComponent(criarState());

    const result = await beforeResolveGuard(
      createRoute('/token', false, { code: 'ssc-code', state }),
      createRoute('/', false)
    );

    expect(result).toEqual({ path: '/exemplo-protegido' });
    expect(getTokenRequest).toHaveBeenCalledWith({ code: 'ssc-code', state });
    expect(useUserStore().userData).toEqual(userData);
    expect(sessionStorage.getItem('redirect_after_login')).toBeNull();
  });

  it('redireciona para erro com código quando a troca do code falha', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(getTokenRequest).mockRejectedValue(new Error('SSC indisponível'));
    const state = decodeURIComponent(criarState());

    const result = await beforeResolveGuard(
      createRoute('/token', false, { code: 'invalid-code', state }),
      createRoute('/', false)
    );

    expect(result).toEqual({
      path: '/erro-autenticacao',
      query: { reason: 'token_exchange_failed' },
    });
    expect(useUserStore().userData).toBeNull();
  });

  it('não troca o code quando não há nonce salvo (login CSRF)', async () => {
    // Link forjado: o fluxo não foi iniciado por esta aplicação.
    const result = await beforeResolveGuard(
      createRoute('/token', false, { code: 'code-do-atacante' }),
      createRoute('/', false)
    );

    expect(result).toEqual({
      path: '/erro-autenticacao',
      query: { reason: 'state_mismatch' },
    });
    expect(getTokenRequest).not.toHaveBeenCalled();
    expect(useUserStore().userData).toBeNull();
  });

  it('não troca o code quando o state diverge do nonce salvo', async () => {
    criarState();

    const result = await beforeResolveGuard(
      createRoute('/token', false, { code: 'ssc-code', state: 'state-adulterado' }),
      createRoute('/', false)
    );

    expect(result).toEqual({
      path: '/erro-autenticacao',
      query: { reason: 'state_mismatch' },
    });
    expect(getTokenRequest).not.toHaveBeenCalled();
  });

  it('permite acesso a rota pública sem consultar autenticação', async () => {
    const result = await beforeResolveGuard(
      createRoute('/', false),
      createRoute('/exemplo-protegido', true)
    );

    expect(result).toBeUndefined();
    expect(startLogin).not.toHaveBeenCalled();
    expect(getUserDataRequest).not.toHaveBeenCalled();
  });

  it('inicia o login quando /token não recebe code', async () => {
    const result = await beforeResolveGuard(createRoute('/token', false), createRoute('/', false));

    expect(result).toBe(false);
    expect(startLogin).toHaveBeenCalledOnce();
  });
});
