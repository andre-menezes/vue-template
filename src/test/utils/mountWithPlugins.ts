import { createPinia } from 'pinia';
import { mount, type ComponentMountingOptions } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { createI18n } from 'vue-i18n';
import { aliases, ms } from '@app/providers/icons';
import ptBR from '@app/locales/pt-BR.json';

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
  messages: { 'pt-BR': ptBR },
});

export function mountWithPlugins<T>(component: T, options: ComponentMountingOptions<T> = {}) {
  return mount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [createPinia(), vuetify, i18n, ...(options.global?.plugins ?? [])],
    },
  });
}
