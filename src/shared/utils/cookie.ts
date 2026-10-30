/**
 * Leitura de cookies legíveis por JavaScript.
 *
 * Usado apenas para cookies NÃO-HttpOnly, como o `XSRF-TOKEN_<modulo>` do
 * double-submit (RF-FE-03). O cookie de sessão (`SID_<modulo>`) é `HttpOnly` e,
 * por definição, não é acessível por aqui.
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

  const prefixo = `${name}=`;
  for (const parte of document.cookie.split(';')) {
    const cookie = parte.trim();
    if (cookie.startsWith(prefixo)) {
      return decodeURIComponent(cookie.slice(prefixo.length));
    }
  }

  return null;
}
