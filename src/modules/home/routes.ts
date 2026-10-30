import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomeView.vue'),
    meta: { nav: { titleKey: 'nav.home', icon: 'dashboard', order: 10 } },
  },
];

export default routes;
