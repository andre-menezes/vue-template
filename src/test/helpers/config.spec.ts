import { describe, expect, it, vi } from 'vitest';
import { AUTH_MOCK, assertAuthMockAllowed } from '@core/config';

describe('config — mock de autenticação (ADR-0017)', () => {
  it('bloqueia o mock no modo production', () => {
    expect(() => assertAuthMockAllowed(true, 'production')).toThrow(/VITE_AUTH_MOCK/);
  });

  it('permite o mock fora do modo production', () => {
    expect(() => assertAuthMockAllowed(true, 'staging')).not.toThrow();
    expect(() => assertAuthMockAllowed(true, 'development')).not.toThrow();
  });

  it('permite o mock desligado em qualquer modo', () => {
    expect(() => assertAuthMockAllowed(false, 'production')).not.toThrow();
  });

  it('lê o flag do ambiente (.env.test define VITE_AUTH_MOCK=false)', () => {
    expect(AUTH_MOCK).toBe(false);
  });

  it('mantém o mock desligado quando a variável não é definida (fail-closed)', async () => {
    vi.stubEnv('VITE_AUTH_MOCK', '');
    vi.resetModules();

    const config = await import('@core/config');

    expect(config.AUTH_MOCK).toBe(false);
    vi.unstubAllEnvs();
  });
});
