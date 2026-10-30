import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { VApp } from 'vuetify/components';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import TheNavigationMenu from '@shared/ui/components/TheNavigationMenu.vue';

const Empty = defineComponent({ render: () => null });

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/decisoes',
        component: Empty,
        // Chaves do locale base, que continuam existindo após o `template:clean`.
        meta: { nav: { titleKey: 'notFound.title', icon: 'gavel', order: 60 } },
      },
      {
        path: '/',
        component: Empty,
        meta: { nav: { titleKey: 'nav.home', icon: 'dashboard', order: 10 } },
      },
      { path: '/sem-menu', component: Empty },
    ],
  });
}

// O v-navigation-drawer depende do layout do <v-app>.
const Host = defineComponent({
  render: () => h(VApp, () => h(TheNavigationMenu, { modelValue: true })),
});

describe('TheNavigationMenu', () => {
  it('lista só as rotas com meta.nav, na ordem de meta.nav.order', async () => {
    const router = createTestRouter();
    await router.push('/');
    const wrapper = mountWithPlugins(Host, { global: { plugins: [router] } });

    const titles = wrapper.findAll('.v-list-item-title').map((item) => item.text());

    expect(titles).toEqual(['Início', 'Página não encontrada']);
  });
});
