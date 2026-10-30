import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/convencoes',
    name: 'Conventions',
    component: () => import('./views/ConventionsView.vue'),
  },
];

export default routes;
