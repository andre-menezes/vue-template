import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createOAuthSSC } from '@core/auth';
import { validarState } from '@core/auth/state';

// Caminho de mock de autenticação (sem SegID real).
vi.mock('@core/config', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@core/config')>()),
  AUTH_MOCK: true,
}));

describe('createOAuthSSC em modo mock', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    setActivePinia(createPinia());
    sessionStorage.clear();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { origin: 'http://localhost:9081', href: '' },
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('vai direto ao callback com um state válido para o guard', () => {
    createOAuthSSC({
      url: 'https://ssc.example',
      client_id: 'client-id',
      contexto: 'm1de',
      response_type: 'code',
      scope: 'openid',
    }).signIn({ route: '/token' });

    const href = window.location.href;
    expect(href).toMatch(/^\/token\?code=mock&state=/);

    // O guard exige nonce: o state gerado no mock precisa ser aceito.
    const state = new URLSearchParams(href.split('?')[1]).get('state');
    expect(validarState(state)).toBe(true);
  });

  it('respeita o BASE_URL ao voltar ao callback', () => {
    vi.stubEnv('BASE_URL', '/meu-app/');

    createOAuthSSC({
      url: 'https://ssc.example',
      client_id: 'client-id',
      contexto: 'm1de',
      response_type: 'code',
      scope: 'openid',
    }).signIn({ route: '/token' });

    expect(window.location.href).toMatch(/^\/meu-app\/token\?code=mock&state=/);
  });
});
