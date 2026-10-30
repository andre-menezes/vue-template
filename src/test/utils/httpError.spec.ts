import { describe, expect, it } from 'vitest';
import { getErrorMessage, isAbortError, isProblemDetails } from '@shared/utils/http-error';

describe('isProblemDetails', () => {
  it('reconhece um corpo com campos do RFC 9457', () => {
    expect(isProblemDetails({ title: 'Erro' })).toBe(true);
    expect(isProblemDetails({ detail: 'x' })).toBe(true);
    expect(isProblemDetails({ status: 404 })).toBe(true);
  });

  it('rejeita valores que não são Problem Details', () => {
    expect(isProblemDetails(null)).toBe(false);
    expect(isProblemDetails('erro')).toBe(false);
    expect(isProblemDetails({ foo: 'bar' })).toBe(false);
  });
});

describe('getErrorMessage', () => {
  it('usa detail do corpo e anexa o status', () => {
    const error = {
      status: 422,
      data: { title: 'Saldo insuficiente', detail: 'Sem saldo.', status: 422 },
    };
    expect(getErrorMessage(error)).toBe('Sem saldo. (HTTP 422)');
  });

  it('cai para o title quando não há detail', () => {
    const error = { data: { title: 'Requisição inválida' } };
    expect(getErrorMessage(error)).toBe('Requisição inválida');
  });

  it('usa statusText + status quando não há corpo Problem Details', () => {
    const error = { status: 404, statusText: 'Not Found' };
    expect(getErrorMessage(error)).toBe('Not Found (HTTP 404)');
  });

  it('usa a mensagem do erro quando não há status nem corpo', () => {
    expect(getErrorMessage(new Error('Falha de rede'))).toBe('Falha de rede');
  });

  it('usa o fallback quando não há informação alguma', () => {
    expect(getErrorMessage({}, 'Algo deu errado.')).toBe('Algo deu errado.');
  });
});

describe('isAbortError', () => {
  const abortError = new DOMException('The operation was aborted.', 'AbortError');

  it('reconhece o AbortError direto e o embrulhado pelo ofetch (cause)', () => {
    expect(isAbortError(abortError)).toBe(true);
    expect(isAbortError(new Error('[GET] "/clientes": <no response>', { cause: abortError }))).toBe(
      true
    );
  });

  it('não trata timeout nem erros comuns como cancelamento', () => {
    const timeout = new DOMException('The operation timed out.', 'TimeoutError');
    expect(isAbortError(new Error('falhou', { cause: timeout }))).toBe(false);
    expect(isAbortError(new Error('HTTP 500'))).toBe(false);
    expect(isAbortError('AbortError')).toBe(false);
  });
});
