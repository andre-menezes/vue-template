import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/componentes',
    name: 'Components',
    component: () => import('./views/ComponentsView.vue'),
  },
];

export default routes;
