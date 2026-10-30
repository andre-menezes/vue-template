import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/token',
    name: 'AuthTokenCallback',
    component: () => import('./views/TokenCallbackView.vue'),
    meta: { layout: 'empty' },
  },
  {
    path: '/erro-autenticacao',
    name: 'AuthError',
    component: () => import('./views/AuthErrorView.vue'),
    meta: { layout: 'empty' },
  },
  {
    // Catch-all: qualquer rota não registrada cai na página 404.
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./views/NotFoundView.vue'),
  },
];

export default routes;
