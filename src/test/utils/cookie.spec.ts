import { afterEach, describe, expect, it } from 'vitest';
import { getCookie } from '@shared/utils/cookie';

describe('getCookie', () => {
  afterEach(() => {
    // Limpa os cookies definidos no teste.
    for (const parte of document.cookie.split(';')) {
      const nome = parte.split('=')[0]?.trim();
      if (nome) {
        document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    }
  });

  it('retorna o valor de um cookie existente', () => {
    document.cookie = 'XSRF-TOKEN_m1de=abc123';
    expect(getCookie('XSRF-TOKEN_m1de')).toBe('abc123');
  });

  it('decodifica valores url-encoded', () => {
    document.cookie = `token=${encodeURIComponent('a b/c')}`;
    expect(getCookie('token')).toBe('a b/c');
  });

  it('não confunde cookies com prefixo em comum', () => {
    document.cookie = 'XSRF-TOKEN_m1de=correto';
    document.cookie = 'XSRF-TOKEN_m1de_extra=errado';
    expect(getCookie('XSRF-TOKEN_m1de')).toBe('correto');
  });

  it('retorna null quando o cookie não existe', () => {
    expect(getCookie('inexistente')).toBeNull();
  });
});
