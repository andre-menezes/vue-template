import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getTokenRequest,
  getUserDataRequest,
  logoutRequest,
} from '@shared/api/services/auth.service';
import { authBackend } from '@shared/api/instances';

vi.mock('@shared/api/instances', () => ({
  authBackend: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// Testa o caminho real (SegID/auth-backend). O mock de autenticação é validado
// separadamente; aqui garantimos que, com AUTH_MOCK desligado, o service chama
// o authBackend com os endpoints corretos.
vi.mock('@core/config', () => ({ AUTH_MOCK: false }));

describe('auth service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('inicia o login BFF via POST /authorization com code/state no corpo', async () => {
    vi.mocked(authBackend.post).mockResolvedValue(undefined);

    await expect(getTokenRequest({ code: 'ssc-code' })).resolves.toBeUndefined();
    expect(authBackend.post).toHaveBeenCalledWith('/authorization', {
      body: { code: 'ssc-code' },
    });
  });

  it('normaliza nomeUsuario para nome no modelo interno', async () => {
    vi.mocked(authBackend.get).mockResolvedValue({
      nomeUsuario: 'Maria Silva',
      email: ['maria@example.com'],
      login: '12345678900',
      unidade: { id: 1, nome: 'Unidade Central', codigo: '001' },
      roles: ['ARCH_PRODEMGE'],
      temMultiplasUnidades: false,
    });

    await expect(getUserDataRequest()).resolves.toMatchObject({
      nome: 'Maria Silva',
      login: '12345678900',
    });
    expect(authBackend.get).toHaveBeenCalledWith('/authorization/user');
  });

  it('encerra a sessão via DELETE /authorization (RF-FE-05)', async () => {
    vi.mocked(authBackend.delete).mockResolvedValue(undefined);

    await expect(logoutRequest()).resolves.toBeUndefined();
    expect(authBackend.delete).toHaveBeenCalledWith('/authorization');
  });
});
