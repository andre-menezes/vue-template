import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/arquitetura',
    name: 'Architecture',
    component: () => import('./views/ArchitectureView.vue'),
    meta: { nav: { titleKey: 'nav.architecture', icon: 'account_tree', order: 20 } },
  },
];

export default routes;
