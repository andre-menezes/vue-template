import type { App } from 'vue';
import pinia from './pinia';
import i18n from './i18n';
import vuetify from './vuetify';
import router from './router';
import { setUnauthorizedHandler } from '@shared/api/instances/auth-error';
import { startLogin } from '@shared/helpers/session';

export function registerPlugins(app: App) {
  app.use(pinia);
  // 401 em qualquer chamada de dados inicia o login (ADR-0017/0018).
  setUnauthorizedHandler(startLogin);
  app.use(i18n);
  app.use(router);
  app.use(vuetify);
}
