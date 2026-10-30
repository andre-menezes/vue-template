import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/decisoes',
    name: 'Decisions',
    component: () => import('./views/DecisionsView.vue'),
  },
];

export default routes;
