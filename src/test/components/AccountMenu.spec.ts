import { describe, expect, it } from 'vitest';
import AccountMenu from '@shared/ui/components/TheAccountMenu.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

const user = {
  nome: 'Maria Silva',
  email: ['maria@example.com'],
  login: '12345678900',
  unidade: { id: 1, nome: 'Unidade Central', codigo: '001' },
  roles: ['ARCH_PRODEMGE' as const],
  temMultiplasUnidades: false,
};

describe('AccountMenu', () => {
  it('exibe os dados da unidade para usuário autenticado', () => {
    const wrapper = mountWithPlugins(AccountMenu, {
      props: { isLoggedIn: true, user, initials: 'MS' },
    });

    expect(wrapper.text()).toContain('Maria Silva');
    expect(wrapper.text()).toContain('Unidade Central');
    expect(wrapper.text()).toContain('001');
  });

  it('emite login para usuário não autenticado', async () => {
    const wrapper = mountWithPlugins(AccountMenu, {
      props: { isLoggedIn: false, user: null, initials: 'U' },
    });

    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('login')).toHaveLength(1);
  });

  it('emite logout para usuário autenticado', async () => {
    const wrapper = mountWithPlugins(AccountMenu, {
      props: { isLoggedIn: true, user, initials: 'MS' },
    });

    await wrapper.findAll('button').at(-1)?.trigger('click');

    expect(wrapper.emitted('logout')).toHaveLength(1);
  });
});
