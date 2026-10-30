import type { TokenRequestParams } from '@typings/auth';
import type { UserDataResponse as ApiUserDataResponse } from '@typings/user';
import type { UserDataResponse } from '@typings/store';
import { AUTH_MOCK } from '@core/config';
import { authBackend } from '../instances';
import { mockUserData } from './auth.mock';

/**
 * Login BFF (Opção B): troca o `code`/`state` do Seg.ID por uma sessão.
 *
 * O backend (`AuthorizationController#login`) responde 204 sem corpo e emite os
 * cookies `SID` (HttpOnly) e `XSRF-TOKEN` via `Set-Cookie`. O token do Seg.ID
 * nunca chega ao navegador — por isso não há retorno de tokens aqui.
 *
 * O cookie é enviado/recebido automaticamente porque a instância HTTP usa
 * `credentials: 'include'` (ver shared/api/instances).
 */
export function getTokenRequest(params: TokenRequestParams): Promise<void> {
  if (AUTH_MOCK) {
    return Promise.resolve();
  }

  return authBackend.post<void, never, TokenRequestParams>('/authorization', {
    body: params,
  });
}

/**
 * Recupera o usuário autenticado a partir do cookie de sessão (RF-FE-02).
 *
 * Não envia token no header: o gateway resolve a identidade pelo cookie `SID`
 * (HttpOnly) e encaminha ao auth-backend em `GET /authorization/user`. O
 * navegador anexa o cookie porque a instância usa `credentials: 'include'`.
 */
export async function getUserDataRequest(): Promise<UserDataResponse> {
  const userData = AUTH_MOCK
    ? mockUserData
    : await authBackend.get<ApiUserDataResponse>('/authorization/user');

  return {
    ...userData,
    nome: userData.nomeUsuario,
  };
}

/**
 * Logout BFF (RF-FE-05): encerra a sessão no backend via `DELETE /authorization`.
 *
 * O backend invalida a sessão e expira os cookies (`Max-Age=0`). A chamada é
 * mutante, então leva o header `X-CSRF-Token` (adicionado pela factory, RF-FE-03).
 * A falha não deve impedir o redirect de logout do SSC — o chamador trata isso.
 */
export function logoutRequest(): Promise<void> {
  if (AUTH_MOCK) {
    return Promise.resolve();
  }

  return authBackend.delete<void>('/authorization');
}
