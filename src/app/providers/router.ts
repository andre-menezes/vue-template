import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const modules = import.meta.glob('@/**/routes.ts', { eager: true });

const routes = [
  ...Object.values(modules as Record<string, { default: RouteRecordRaw[] }>).flatMap(
    (module) => module.default
  ),
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0, behavior: 'smooth' };
  },
});

export default router;
