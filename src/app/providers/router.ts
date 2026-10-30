import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { nextTick } from 'vue';

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

router.afterEach((to) => {
  nextTick(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view', {
        page_path: to.path,
        page_title: to.name ? String(to.name) : document.title,
        page_location: window.location.href,
      });
    }
  });
});

export default router;
