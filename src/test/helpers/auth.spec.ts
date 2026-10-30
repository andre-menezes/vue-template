import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createOAuthSSC } from '@core/auth';

// Testa o caminho SegID real (mock de autenticação desligado).
vi.mock('@core/config', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@core/config')>()),
  AUTH_MOCK: false,
}));

const options = {
  url: 'https://ssc.example',
  client_id: 'client-id',
  contexto: 's1f6',
  response_type: 'code',
  scope: 'openid',
};

/** Lê os parâmetros (já decodificados) da URL para onde o app redirecionou. */
function redirectedParams(): URLSearchParams {
  return new URL(window.location.href).searchParams;
}

describe('createOAuthSSC', () => {
  const originalLocation = window.location;

  beforeEach(() => {
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

  it('monta a URL de login com state e redireciona', () => {
    createOAuthSSC(options).signIn({ route: '/token' });

    const href = window.location.href;
    expect(href).toMatch(/^https:\/\/ssc\.example\/auth\/\?/);

    const params = redirectedParams();
    expect(Object.fromEntries(params)).toMatchObject({
      client_id: 'client-id',
      contexto: 's1f6',
      response_type: 'code',
      scope: 'openid',
      selecaoAutomaticaUnidade: 'true',
      redirect_uri: 'http://localhost:9081/token',
    });

    // RF-FE-06: o state é um Base64URL de JSON { m, n }, com o nonce persistido.
    const state = params.get('state');
    expect(state).toBeTruthy();
    const payload = JSON.parse(atob((state as string).replace(/-/g, '+').replace(/_/g, '/'))) as {
      m: string;
      n: string;
    };
    expect(payload.m).toBe('m1de');
    expect(payload.n).toBe(sessionStorage.getItem('auth_nonce'));
  });

  it('codifica a redirect_uri e os valores de configuração', () => {
    createOAuthSSC({ ...options, scope: 'openid profile&admin=true' }).signIn({
      route: '/token',
    });

    const href = window.location.href;
    // Nada de `&`/`:` crus vindos dos valores: cada um vira um único parâmetro.
    expect(href).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A9081%2Ftoken');
    expect(href).not.toContain('&admin=true');

    const params = redirectedParams();
    expect(params.get('scope')).toBe('openid profile&admin=true');
    expect(params.has('admin')).toBe(false);
  });

  it('inclui o BASE_URL na redirect_uri quando o app roda em subcaminho', () => {
    vi.stubEnv('BASE_URL', '/meu-app/');

    createOAuthSSC(options).signIn({ route: '/token' });

    expect(redirectedParams().get('redirect_uri')).toBe('http://localhost:9081/meu-app/token');
  });

  it('monta a URL de logout do SSC', () => {
    createOAuthSSC(options).signOut({ route: '/' });

    expect(window.location.href).toBe(
      'https://ssc.example/logout?logout_page=http%3A%2F%2Flocalhost%3A9081%2F'
    );
    expect(redirectedParams().get('logout_page')).toBe('http://localhost:9081/');
  });

  it('inclui o BASE_URL na página de retorno do logout', () => {
    vi.stubEnv('BASE_URL', '/meu-app/');

    createOAuthSSC(options).signOut({ route: '/' });

    expect(redirectedParams().get('logout_page')).toBe('http://localhost:9081/meu-app/');
  });
});
