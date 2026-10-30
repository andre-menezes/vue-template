import type { RouteRecordRaw } from 'vue-router';

/**
 * Telas de documentação do template. O módulo inteiro é removido por
 * `pnpm template:clean` ao iniciar um projeto novo.
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/docs',
    name: 'DocsHome',
    component: () => import('./views/DocsHomeView.vue'),
    meta: { nav: { titleKey: 'nav.docs', icon: 'menu_book', order: 100 } },
  },
  {
    path: '/arquitetura',
    name: 'Architecture',
    component: () => import('./views/ArchitectureView.vue'),
    meta: { nav: { titleKey: 'nav.architecture', icon: 'account_tree', order: 110 } },
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('./views/OnboardingView.vue'),
    meta: { nav: { titleKey: 'nav.onboarding', icon: 'rocket_launch-fill', order: 120 } },
  },
  {
    path: '/componentes',
    name: 'Components',
    component: () => import('./views/ComponentsView.vue'),
    meta: { nav: { titleKey: 'nav.components', icon: 'palette', order: 130 } },
  },
  {
    path: '/convencoes',
    name: 'Conventions',
    component: () => import('./views/ConventionsView.vue'),
    meta: { nav: { titleKey: 'nav.conventions', icon: 'checklist', order: 140 } },
  },
  {
    path: '/decisoes',
    name: 'Decisions',
    component: () => import('./views/DecisionsView.vue'),
    meta: { nav: { titleKey: 'nav.decisions', icon: 'gavel', order: 150 } },
  },
];

export default routes;
