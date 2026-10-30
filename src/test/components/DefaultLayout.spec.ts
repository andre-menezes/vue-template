import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import DefaultLayout from '@shared/ui/layouts/DefaultLayout.vue';
import TheAppHeader from '@shared/ui/components/TheAppHeader.vue';
import TheNavigationMenu from '@shared/ui/components/TheNavigationMenu.vue';

// O layout depende do contexto do <v-app>; envolvemos para montar isolado.
const Host = defineComponent({
  render: () => h(DefaultLayout),
});

function mountLayout() {
  return mountWithPlugins(Host, {
    global: {
      stubs: {
        TheAppHeader: true,
        TheNavigationMenu: true,
        VMain: true,
      },
    },
  });
}

describe('DefaultLayout', () => {
  it('alterna o menu de navegação quando o header emite toggleNavigation', async () => {
    const wrapper = mountLayout();
    const menu = () => wrapper.findComponent(TheNavigationMenu);
    const initial = menu().props('modelValue');

    wrapper.findComponent(TheAppHeader).vm.$emit('toggleNavigation');
    await wrapper.vm.$nextTick();

    expect(menu().props('modelValue')).toBe(!initial);
  });
});
