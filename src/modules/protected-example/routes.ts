import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/exemplo-protegido',
    name: 'ProtectedExample',
    component: () => import('./views/ProtectedExampleView.vue'),
    meta: { requiresAuth: true },
  },
];

export default routes;
