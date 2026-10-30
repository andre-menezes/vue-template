import type { App } from 'vue';
import pinia from './pinia';
import i18n from './i18n';
import vuetify from './vuetify';
import router from './router';

export function registerPlugins(app: App) {
  app.use(pinia);
  app.use(i18n);
  app.use(router);
  app.use(vuetify);
}
