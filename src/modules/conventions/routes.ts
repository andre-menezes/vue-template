import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/convencoes',
    name: 'Conventions',
    component: () => import('./views/ConventionsView.vue'),
    meta: { nav: { titleKey: 'nav.conventions', icon: 'checklist', order: 50 } },
  },
];

export default routes;
