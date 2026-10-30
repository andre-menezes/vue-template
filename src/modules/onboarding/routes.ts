import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('./views/OnboardingView.vue'),
    meta: { nav: { titleKey: 'nav.onboarding', icon: 'rocket_launch-fill', order: 30 } },
  },
];

export default routes;
