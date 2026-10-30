import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { cleanStorage, endSession, startLogin } from '@shared/helpers/session';
import { logoutRequest } from '@shared/api/services/auth.service';
import { createOAuthSSC } from '@core/auth';
import { useAppStore } from '@shared/stores/app.store';
import { useUserStore } from '@shared/stores/user.store';

const signIn = vi.fn();
const signOut = vi.fn();

vi.mock('@core/auth', () => ({
  OAuthSSCConfig: {},
  createOAuthSSC: vi.fn(),
}));

// Isola da rede: o logout do backend é sempre mockado.
vi.mock('@shared/api/services/auth.service', () => ({
  logoutRequest: vi.fn(),
}));

const userData = {
  nome: 'Maria Silva',
  email: ['maria@example.com'],
  login: '12345678900',
  unidade: { id: 1, nome: 'Unidade Central', codigo: '001' },
  roles: ['ARCH_PRODEMGE' as const],
  temMultiplasUnidades: false,
};

describe('helpers/session', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(createOAuthSSC).mockReturnValue({ signIn, signOut });
  });

  it('cleanStorage limpa a sessão e preserva a preferência de tema', () => {
    const appStore = useAppStore();
    const userStore = useUserStore();
    userStore.setUserData(userData);
    appStore.switchTheme();
    appStore.setLoading(true);
    localStorage.setItem('last_activity', '123');

    cleanStorage();

    expect(userStore.isAuthorized).toBe(false);
    expect(userStore.userData).toBeNull();
    expect(appStore.loading).toBe(false);
    expect(appStore.theme).toBe('dark');
    expect(localStorage.getItem('last_activity')).toBeNull();
  });

  it('startLogin limpa a sessão e redireciona ao SSC', () => {
    useUserStore().setUserData(userData);

    startLogin();

    expect(useUserStore().isAuthorized).toBe(false);
    expect(signIn).toHaveBeenCalledWith({ route: '/token' });
  });

  it('endSession encerra no backend, limpa a sessão e faz logout no SSC', async () => {
    useUserStore().setUserData(userData);

    await endSession('/');

    expect(logoutRequest).toHaveBeenCalledOnce();
    expect(useUserStore().isAuthorized).toBe(false);
    expect(signOut).toHaveBeenCalledWith({ route: '/' });
  });

  it('endSession segue para o logout do SSC mesmo se o backend falhar', async () => {
    vi.mocked(logoutRequest).mockRejectedValue(new Error('indisponível'));

    await endSession();

    expect(signOut).toHaveBeenCalledWith({ route: '/token' });
  });
});
