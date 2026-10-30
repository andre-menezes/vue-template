/**
 * Montagem e validação do `state` do OAuth (RF-FE-06).
 *
 * O `state` carrega o módulo (`m`) e um nonce (`n`) em JSON Base64URL. O módulo
 * permite ao backend/gateway resolver o cookie por módulo; o nonce protege
 * contra CSRF no retorno do SSC (o valor gerado no `signIn` é comparado com o
 * que volta na `redirect_uri`). O `state` volta intacto (manual Seg.ID, 5.1).
 */
import { APP_MODULO, STORAGE_KEYS } from '@core/config';

interface AuthState {
  /** Módulo da aplicação. */
  m: string;
  /** Nonce de uso único. */
  n: string;
}

/** Codifica em Base64URL (sem padding), seguro para query string. */
function toBase64Url(texto: string): string {
  return btoa(texto).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Decodifica Base64URL para texto. */
function fromBase64Url(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  return atob(b64);
}

/** Gera um nonce aleatório. */
function gerarNonce(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Cria o `state` do login: gera o nonce, persiste-o em `sessionStorage` para
 * validação no retorno e devolve o valor url-encoded pronto para a URL do SSC.
 */
export function criarState(): string {
  const nonce = gerarNonce();
  sessionStorage.setItem(STORAGE_KEYS.AUTH_NONCE, nonce);

  const payload: AuthState = { m: APP_MODULO, n: nonce };
  return encodeURIComponent(toBase64Url(JSON.stringify(payload)));
}

/**
 * Valida o `state` retornado pelo SSC: confere o nonce contra o valor salvo e
 * consome-o (uso único). Retorna `true` apenas quando confere.
 *
 * Sem nonce salvo, o retorno é rejeitado: todo login iniciado por esta
 * aplicação gera um nonce no `signIn`. Aceitar um `code` sem nonce permitiria
 * login CSRF (um link `/token?code=<code_do_atacante>` logaria a vítima na
 * conta do atacante) — ver ADR-0017.
 */
export function validarState(stateParam: string | null): boolean {
  const nonceSalvo = sessionStorage.getItem(STORAGE_KEYS.AUTH_NONCE);
  if (!nonceSalvo) {
    return false;
  }

  sessionStorage.removeItem(STORAGE_KEYS.AUTH_NONCE);

  if (!stateParam) {
    return false;
  }

  try {
    const payload = JSON.parse(fromBase64Url(decodeURIComponent(stateParam))) as AuthState;
    return payload.n === nonceSalvo;
  } catch {
    return false;
  }
}
