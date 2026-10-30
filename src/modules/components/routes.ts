import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/componentes',
    name: 'Components',
    component: () => import('./views/ComponentsView.vue'),
    meta: { nav: { titleKey: 'nav.components', icon: 'palette', order: 40 } },
  },
];

export default routes;
