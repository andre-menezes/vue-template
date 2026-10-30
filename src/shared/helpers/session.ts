import { STORAGE_KEYS } from '@core/config';
import { createOAuthSSC, OAuthSSCConfig } from '@core/auth';
import { logoutRequest } from '@shared/api/services/auth.service';
import { useAppStore } from '@shared/stores/app.store';
import { useUserStore } from '@shared/stores/user.store';

/** Rota de callback do SSC (troca do code pela sessão no guard). */
const TOKEN_ROUTE = '/token';

/**
 * Limpa o estado local da sessão do usuário (stores e marcas de atividade).
 *
 * O token de autenticação vive em um cookie `HttpOnly` gerido pelo backend e
 * não é acessível ao JavaScript — sua invalidação acontece em `endSession`.
 * Preferências de UX (ex.: tema) não fazem parte da sessão e são preservadas.
 */
export function cleanStorage(): void {
  useAppStore().setLoading(false);
  useUserStore().setUserData(null);

  localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
}

/**
 * Inicia o login no SSC: limpa o estado local e redireciona.
 * O destino pós-login (`redirect_after_login`) é salvo pelo chamador.
 */
export function startLogin(): void {
  cleanStorage();
  createOAuthSSC(OAuthSSCConfig).signIn({ route: TOKEN_ROUTE });
}

/**
 * Encerra a sessão: invalida a sessão no backend (RF-FE-05, best-effort),
 * limpa o estado local e redireciona ao logout do SSC.
 */
export async function endSession(route = TOKEN_ROUTE): Promise<void> {
  try {
    await logoutRequest();
  } catch {
    // Best-effort: o logout no SSC prossegue mesmo se o backend falhar.
  }

  cleanStorage();
  createOAuthSSC(OAuthSSCConfig).signOut({ route });
}
