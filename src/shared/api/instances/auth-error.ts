/**
 * Tratamento global de erros de autenticação/autorização nas chamadas de API
 * (RF-FE-04). Centralizado aqui para não espalhar lógica de sessão pela factory
 * HTTP nem pelas views.
 *
 * - `401`: sessão inexistente ou expirada. Guarda a rota atual em
 *   `redirect_after_login` e aciona o handler registrado pela camada `app`
 *   (`setUnauthorizedHandler`), que limpa o estado e inicia o login no SSC.
 * - `403` com causa de CSRF: token CSRF ausente/divergente. NÃO redireciona;
 *   apenas registra, para a view decidir como informar o usuário.
 * - Demais status: ignorados (tratados pelo chamador).
 */
import { STORAGE_KEYS } from '@core/config';
import { isProblemDetails } from '@shared/utils/http-error';

/** Evita múltiplos redirecionamentos simultâneos de login a partir de 401s em paralelo. */
let redirecionandoLogin = false;

/** Ação de login registrada no bootstrap (inversão de dependência — ADR-0018). */
let unauthorizedHandler: (() => void) | null = null;

/**
 * Registra a ação executada em 401 (ex.: `startLogin`). Chamado pela camada
 * `app` no bootstrap: a camada HTTP não conhece o fluxo de login, o que evita
 * o ciclo instances → session → services → instances.
 */
export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

/**
 * Avalia o status/corpo de uma resposta de erro e aplica o efeito de sessão.
 *
 * @param status status HTTP da resposta
 * @param data   corpo da resposta (possivelmente um Problem Details)
 */
export function handleAuthError(status: number, data: unknown): void {
  if (status === 401) {
    iniciarLogin();
    return;
  }

  if (status === 403 && isErroCsrf(data)) {
    // CSRF inválido não deve deslogar: a sessão segue válida. A mensagem fica a
    // cargo da view (via getErrorMessage sobre o erro propagado).
    console.warn('[auth] Requisição rejeitada por CSRF inválido.');
  }
}

/** Detecta se o corpo do 403 indica falha de CSRF (RFC 9457). */
function isErroCsrf(data: unknown): boolean {
  if (!isProblemDetails(data)) {
    return false;
  }
  const texto = `${data.title ?? ''} ${data.detail ?? ''} ${data.type ?? ''}`.toLowerCase();
  return texto.includes('csrf');
}

function iniciarLogin(): void {
  if (redirecionandoLogin) {
    return;
  }
  redirecionandoLogin = true;

  if (typeof window !== 'undefined') {
    const rotaAtual = window.location.pathname + window.location.search;
    if (!rotaAtual.startsWith('/token')) {
      sessionStorage.setItem(STORAGE_KEYS.REDIRECT, rotaAtual);
    }
  }

  unauthorizedHandler?.();
}
