import { beforeEach, describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { VApp } from 'vuetify/components';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import { useAppStore } from '@shared/stores/app.store';
import TheAppHeader from '@shared/ui/components/TheAppHeader.vue';

// O v-app-bar depende do layout do <v-app>.
const Host = defineComponent({
  emits: ['toggleNavigation'],
  setup(_, { emit }) {
    return () =>
      h(VApp, () => h(TheAppHeader, { onToggleNavigation: () => emit('toggleNavigation') }));
  },
});

describe('TheAppHeader', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('alterna o tema pelo botão do cabeçalho', async () => {
    const wrapper = mountWithPlugins(Host);
    const store = useAppStore();
    const button = () => wrapper.find('button[aria-label="Ativar tema escuro"]');
    expect(store.theme).toBe('light');

    await button().trigger('click');

    expect(store.theme).toBe('dark');
    expect(wrapper.find('button[aria-label="Ativar tema claro"]').exists()).toBe(true);
    expect(button().exists()).toBe(false);
  });

  it('emite toggleNavigation pelo ícone do menu', async () => {
    const wrapper = mountWithPlugins(Host);

    await wrapper.find('.v-app-bar-nav-icon').trigger('click');

    expect(wrapper.emitted('toggleNavigation')).toHaveLength(1);
  });
});
