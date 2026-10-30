import { createPinia } from 'pinia';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { mount, type ComponentMountingOptions } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { createI18n } from 'vue-i18n';
import { aliases, ms } from '@app/providers/icons';
import { ptBRMessages } from '@app/providers/messages';

const vuetify = createVuetify({
  icons: {
    defaultSet: 'ms',
    aliases,
    sets: { ms },
  },
});

const i18n = createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages: { 'pt-BR': ptBRMessages },
});

/** Cliente novo a cada montagem: sem cache entre testes e sem nova tentativa. */
function createTestQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

export function mountWithPlugins<T>(component: T, options: ComponentMountingOptions<T> = {}) {
  return mount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [
        createPinia(),
        [VueQueryPlugin, { queryClient: createTestQueryClient() }],
        vuetify,
        i18n,
        ...(options.global?.plugins ?? []),
      ],
    },
  });
}
