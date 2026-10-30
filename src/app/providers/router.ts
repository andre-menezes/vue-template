import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteLocationNormalized,
  type RouteLocationRaw,
} from 'vue-router';
import { nextTick } from 'vue';
import { useUserStore } from '@shared/stores/user.store';
import { getTokenRequest, getUserDataRequest } from '@shared/api/services/auth.service';
import { startLogin } from '@shared/helpers/session';
import { validarState } from '@core/auth/state';
import { STORAGE_KEYS } from '@core/config';
import type { AuthErrorReason } from '@typings/auth';

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

/**
 * Rota da tela de erro de autenticação. Envia apenas um código conhecido: texto
 * livre em query string permitiria forjar mensagens com a identidade visual do
 * sistema (ex.: `?msg=Ligue para ...`).
 */
function authErrorRoute(reason: AuthErrorReason): RouteLocationRaw {
  return { path: '/erro-autenticacao', query: { reason } };
}

export async function beforeResolveGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized
): Promise<RouteLocationRaw | boolean | void> {
  const userStore = useUserStore();

  if (to.path === '/token') {
    const codeQuery = to.query['code'];
    const sscCode = typeof codeQuery === 'string' ? codeQuery : '';
    const stateQuery = to.query['state'];
    const sscState = typeof stateQuery === 'string' ? stateQuery : null;

    if (sscCode) {
      // RF-FE-06: valida o nonce do state antes de trocar o code. Divergência
      // indica retorno adulterado/forjado — não troca o code.
      if (!validarState(sscState)) {
        userStore.setUserData(null);
        return authErrorRoute('state_mismatch');
      }

      try {
        // Login BFF: o backend cria a sessão e responde com Set-Cookie
        // (SID HttpOnly + XSRF-TOKEN). Sem corpo (204).
        await getTokenRequest({ code: sscCode, state: sscState ?? undefined });

        userStore.setUserData(await getUserDataRequest());

        const redirectTo = sessionStorage.getItem(STORAGE_KEYS.REDIRECT) || '/';
        sessionStorage.removeItem(STORAGE_KEYS.REDIRECT);
        return { path: redirectTo };
      } catch (error) {
        userStore.setUserData(null);
        console.error('[auth] Falha na troca do code por sessão.', error);
        return authErrorRoute('token_exchange_failed');
      }
    }

    startLogin();

    return false;
  }

  if (!to.meta.requiresAuth) {
    return;
  }

  // Rotas protegidas: a sessão é validada pelo backend. O cookie HttpOnly é
  // enviado automaticamente; se ainda não temos os dados do usuário, tentamos
  // carregá-los. Sucesso = sessão válida; falha (ex.: 401) = sem sessão.
  if (!userStore.userData) {
    try {
      userStore.setUserData(await getUserDataRequest());
    } catch {
      userStore.setUserData(null);

      sessionStorage.setItem(STORAGE_KEYS.REDIRECT, to.fullPath);
      startLogin();

      return false;
    }
  }
}

router.beforeResolve(beforeResolveGuard);

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
