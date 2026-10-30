import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/decisoes',
    name: 'Decisions',
    component: () => import('./views/DecisionsView.vue'),
    meta: { nav: { titleKey: 'nav.decisions', icon: 'gavel', order: 60 } },
  },
];

export default routes;
