import { beforeEach, describe, expect, it } from 'vitest';
import { criarState, validarState } from '@core/auth/state';

// Usa o módulo real (APP_MODULO deriva de VITE_SEGID_CONTEXT=m1de no ambiente de teste).
describe('auth state (RF-FE-06)', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('criarState persiste o nonce e codifica { m, n } em Base64URL', () => {
    const state = criarState();
    const nonce = sessionStorage.getItem('auth_nonce');

    expect(nonce).toBeTruthy();

    const payload = JSON.parse(
      atob(decodeURIComponent(state).replace(/-/g, '+').replace(/_/g, '/'))
    ) as { m: string; n: string };

    expect(payload.m).toBe('m1de');
    expect(payload.n).toBe(nonce);
  });

  it('validarState aprova o state gerado e consome o nonce (uso único)', () => {
    const state = criarState();

    expect(validarState(state)).toBe(true);
    // Nonce consumido: uma segunda validação não tem o que comparar.
    expect(sessionStorage.getItem('auth_nonce')).toBeNull();
  });

  it('validarState rejeita nonce divergente', () => {
    criarState();
    const forjado = encodeURIComponent(
      btoa(JSON.stringify({ m: 'm1de', n: 'outro-nonce' }))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
    );

    expect(validarState(forjado)).toBe(false);
  });

  it('validarState rejeita state ausente quando havia nonce salvo', () => {
    criarState();
    expect(validarState(null)).toBe(false);
  });

  it('validarState rejeita retorno sem nonce salvo (login CSRF)', () => {
    expect(validarState(null)).toBe(false);
  });

  it('validarState rejeita state forjado quando não há nonce salvo', () => {
    const forjado = encodeURIComponent(
      btoa(JSON.stringify({ m: 'm1de', n: 'nonce-do-atacante' }))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
    );

    expect(validarState(forjado)).toBe(false);
  });
});
