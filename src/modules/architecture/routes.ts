import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/arquitetura',
    name: 'Architecture',
    component: () => import('./views/ArchitectureView.vue'),
  },
];

export default routes;
