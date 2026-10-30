import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('./views/OnboardingView.vue'),
  },
];

export default routes;
