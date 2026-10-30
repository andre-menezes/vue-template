import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '@shared/stores/user.store';

describe('userStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('autoriza a aplicação quando recebe dados do usuário', () => {
    const userStore = useUserStore();

    userStore.setUserData({
      nome: 'Maria Silva',
      email: ['maria@example.com'],
      login: '12345678900',
      unidade: { id: 1, nome: 'Unidade Central', codigo: '001' },
      roles: ['ARCH_PRODEMGE'],
      temMultiplasUnidades: false,
    });

    expect(userStore.userData?.login).toBe('12345678900');
    expect(userStore.isAuthorized).toBe(true);
  });

  it('remove a autorização quando limpa os dados do usuário', () => {
    const userStore = useUserStore();

    userStore.setUserData(null);

    expect(userStore.userData).toBeNull();
    expect(userStore.isAuthorized).toBe(false);
  });
});
