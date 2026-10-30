/**
 * Cliente OAuth do SSC (Seg.ID): monta as URLs de login/logout e redireciona.
 *
 * Fica em `core` e não conhece stores nem services: limpar o estado local e
 * encerrar a sessão no backend é orquestrado por `@shared/helpers/session`
 * (`startLogin` / `endSession`). Isso elimina o ciclo app ↔ shared (ADR-0018).
 */
import type { OAuthSSC, OAuthSSCOptions, OAuthSSCSignInOptions } from '@typings/auth';
import { criarState } from './state';
import {
  AUTH_MOCK,
  SEGID_BASE_URL,
  SEGID_CLIENT_ID,
  SEGID_CONTEXT,
  SEGID_RESPONSE_TYPE,
  SEGID_SCOPE,
} from '@core/config';

export const OAuthSSCConfig: OAuthSSCOptions = {
  url: SEGID_BASE_URL,
  client_id: SEGID_CLIENT_ID,
  contexto: SEGID_CONTEXT,
  response_type: SEGID_RESPONSE_TYPE,
  scope: SEGID_SCOPE,
};

/**
 * Caminho da rota do app considerando o `base` do Vite (`BASE_URL`), para que
 * o redirecionamento funcione quando o app é publicado em subcaminho
 * (ex.: `/meu-app/token`). `route` é a rota do router, iniciada por `/`.
 */
function buildAppPath(route: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}${route}`;
}

/** URL absoluta da rota do app, usada como retorno do SSC. */
function buildRedirectUri(route: string): string {
  return `${window.location.origin}${buildAppPath(route)}`;
}

export function createOAuthSSC(options: OAuthSSCOptions): OAuthSSC {
  const { url, client_id, response_type, scope, contexto } = options;
  const config: Omit<OAuthSSCOptions, 'url'> = {
    client_id: client_id,
    contexto: contexto,
    response_type: response_type,
    scope: scope,
  };

  const signIn = ({ route }: OAuthSSCSignInOptions): void => {
    // Modo mock: pula o SegID e vai direto ao callback com um code fake.
    // O guard troca esse code pelo token mockado (ver auth.service + auth.mock).
    // O state também é gerado aqui, pois o guard sempre exige o nonce.
    if (AUTH_MOCK) {
      const query = new URLSearchParams({ code: 'mock', state: criarState() });
      location.href = `${buildAppPath(route)}?${query}`;
      return;
    }

    // URLSearchParams codifica cada valor: `&`, `=`, `#` ou espaço em um valor
    // de configuração (ou na redirect_uri) não corrompem a URL do SSC.
    const query = new URLSearchParams({
      ...config,
      // RF-FE-06: state com módulo + nonce (validado no retorno pelo guard).
      state: criarState(),
      selecaoAutomaticaUnidade: 'true',
      redirect_uri: buildRedirectUri(route),
    });

    location.href = `${url}/auth/?${query}`;
  };

  const signOut = ({ route }: OAuthSSCSignInOptions): void => {
    const query = new URLSearchParams({ logout_page: buildRedirectUri(route) });
    location.href = `${url}/logout?${query}`;
  };

  return {
    signIn,
    signOut,
  };
}
