import { afterEach, describe, expect, it, vi } from 'vitest';
import { getEnvVar } from '@core/config';

describe('getEnvVar', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('usa o valor definido no ambiente', () => {
    vi.stubEnv('VITE_APP_NAME', 'Meu Sistema');

    expect(getEnvVar('VITE_APP_NAME', 'Vue Template')).toBe('Meu Sistema');
  });

  it('usa o valor padrão quando a variável está vazia', () => {
    vi.stubEnv('VITE_APP_NAME', '');

    expect(getEnvVar('VITE_APP_NAME', 'Vue Template')).toBe('Vue Template');
  });

  it('falha com a variável no erro quando não há valor nem padrão', () => {
    vi.stubEnv('VITE_APP_NAME', '');

    expect(() => getEnvVar('VITE_APP_NAME')).toThrow(
      '[Config Error]: A variável de ambiente VITE_APP_NAME não foi definida.'
    );
  });
});

describe('constantes de configuração', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('lê as variáveis do ambiente ao carregar', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.exemplo.gov.br');
    vi.resetModules();

    const { API_BASE_URL } = await import('@core/config');

    expect(API_BASE_URL).toBe('https://api.exemplo.gov.br');
  });

  it('roda sem nenhum .env, com os valores padrão', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '');
    vi.stubEnv('VITE_APP_NAME', '');
    vi.stubEnv('VITE_APP_DEFAULT_LOCALE', '');
    vi.resetModules();

    const config = await import('@core/config');

    expect([config.API_BASE_URL, config.APP_NAME, config.DEFAULT_LOCALE]).toEqual([
      '/api',
      'Vue Template',
      'pt-BR',
    ]);
  });
});
