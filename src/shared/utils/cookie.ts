/**
 * Leitura de cookies legíveis por JavaScript.
 *
 * Funciona apenas para cookies NÃO-HttpOnly (ex.: um token CSRF de
 * double-submit). Cookies `HttpOnly` (ex.: o de sessão) não são, por
 * definição, acessíveis por aqui.
 */

/**
 * Retorna o valor de um cookie pelo nome, ou `null` se ausente.
 *
 * @param name nome do cookie
 * @returns o valor decodificado, ou `null` quando o cookie não existe
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined' || !document.cookie) {
    return null;
  }

  const prefix = `${name}=`;
  for (const part of document.cookie.split(';')) {
    const cookie = part.trim();
    if (cookie.startsWith(prefix)) {
      return decodeURIComponent(cookie.slice(prefix.length));
    }
  }

  return null;
}
