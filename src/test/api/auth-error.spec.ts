import { beforeEach, describe, expect, it, vi } from 'vitest';

const onUnauthorized = vi.fn();

async function loadHandler() {
  const module = await import('@shared/api/instances/auth-error');
  module.setUnauthorizedHandler(onUnauthorized);
  return module.handleAuthError;
}

describe('handleAuthError (RF-FE-04)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reinicia a trava de redirecionamento e o handler registrado.
    vi.resetModules();
    sessionStorage.clear();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { pathname: '/exemplo-protegido', search: '?a=1' },
    });
  });

  it('em 401 guarda a rota e aciona o handler registrado pelo app', async () => {
    const handleAuthError = await loadHandler();

    handleAuthError(401, undefined);

    expect(sessionStorage.getItem('redirect_after_login')).toBe('/exemplo-protegido?a=1');
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it('em 401s simultâneos aciona o login uma única vez', async () => {
    const handleAuthError = await loadHandler();

    handleAuthError(401, undefined);
    handleAuthError(401, undefined);

    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it('em 401 não guarda a rota quando já está em /token', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { pathname: '/token', search: '?code=x' },
    });
    const handleAuthError = await loadHandler();

    handleAuthError(401, undefined);

    expect(sessionStorage.getItem('redirect_after_login')).toBeNull();
  });

  it('em 403 de CSRF não redireciona', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const handleAuthError = await loadHandler();

    handleAuthError(403, { title: 'CSRF inválido', status: 403 });

    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it('ignora outros status (ex.: 500)', async () => {
    const handleAuthError = await loadHandler();

    handleAuthError(500, undefined);

    expect(onUnauthorized).not.toHaveBeenCalled();
  });
});
