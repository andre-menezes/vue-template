# ADR-0015: Integração BFF — CSRF, state do OAuth e logout no backend

- **Status:** Aceita
- **Data:** 2026-10-26
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0003 (Autenticação OAuth/SSC no router guard), ADR-0014 (Sessão em cookie HttpOnly)

## Contexto e problema

A ADR-0014 adotou a sessão em cookie `HttpOnly` emitido pelo backend. Com o BFF
(Backend-for-Frontend) por cookie consolidado, o frontend precisa fechar o
contrato de ponta a ponta: proteger as requisições mutantes contra CSRF, validar
o retorno do SSC contra adulteração e encerrar a sessão no backend no logout.
Antes destas mudanças o frontend não enviava token CSRF, não validava o `state`
do OAuth e o logout só redirecionava ao SSC sem encerrar a sessão do BFF.

## Drivers da decisão

- Segurança: cookie `HttpOnly` sozinho não protege contra CSRF em requisições mutantes.
- Integridade do fluxo OAuth: o retorno do SSC precisa ser verificável (nonce).
- Encerramento real da sessão no logout (não só no IDP).
- Centralizar o comportamento na camada HTTP, sem espalhar lógica pelas views.
- Multi-módulo: o cookie e o header de módulo variam por módulo da aplicação.

## Opções consideradas

- **Double-submit cookie (CSRF)** — o backend emite o cookie legível
  `XSRF-TOKEN_<modulo>`, e o frontend o reenvia no header `X-CSRF-Token`. Simples,
  sem estado extra no cliente, compatível com domínio compartilhado.
- **Token CSRF em memória via header exposto no CORS** — evita ler cookie, mas
  exige guardar estado e um fluxo extra para obter o token. Descartada para domínio
  compartilhado; fica como alternativa para domínios sem relação.
- **State opaco vs. state estruturado** — adotado o `state` estruturado (JSON
  Base64URL com `m`=módulo e `n`=nonce), que carrega o módulo e o nonce num só valor.

## Decisão

1. **CSRF (double-submit):** nas requisições `POST|PUT|PATCH|DELETE`, a factory HTTP
   (`onRequest`) lê o cookie `XSRF-TOKEN_<modulo>` e o reenvia no header
   `X-CSRF-Token`. Nomes centralizados em `@app/config` (`CSRF_COOKIE_NAME`,
   `CSRF_HEADER_NAME`), o módulo em `APP_MODULO`.
2. **Header de módulo:** toda requisição envia `x-id-modulo` com o módulo da
   aplicação, para o gateway resolver o cookie por módulo.
3. **State com nonce:** o `signIn` gera um nonce, monta o `state` (Base64URL de
   `{m,n}`), persiste o nonce em `sessionStorage` e o anexa à URL do SSC. No
   retorno (`/token`), o guard valida o nonce antes de trocar o code; divergência
   leva à tela de erro, sem trocar o code.
4. **Logout no backend:** o `signOut` chama `DELETE /authorization` (com o header
   CSRF) antes de redirecionar ao logout do SSC. A falha é best-effort e não impede
   o redirect.
5. **401/403 global:** a factory HTTP (`onResponseError`) trata `401` (limpa a
   sessão, guarda a rota em `redirect_after_login` e inicia o login) e `403` com
   causa de CSRF (não desloga; a view informa o usuário).

## Consequências

### Positivas

- Requisições mutantes protegidas contra CSRF sem estado extra no cliente.
- Retorno do SSC verificável (nonce de uso único).
- Logout encerra a sessão do BFF, não só a do IDP.
- Tratamento de sessão expirada uniforme para qualquer chamada autenticada.

### Negativas / trade-offs

- O double-submit exige que o cookie de CSRF seja legível pelo frontend (mesmo
  domínio ou domínio compartilhado). Domínios sem relação exigiriam a alternativa
  em memória.
- O `onResponseError` e o guard compartilham a lógica de iniciar login; é preciso
  evitar redirecionamento duplicado (tratado com uma trava simples).

### Neutras

- Novas variáveis de ambiente opcionais: `VITE_APP_MODULO`, `VITE_CSRF_COOKIE_PREFIX`,
  `VITE_CSRF_HEADER_NAME` (todas com default).

## Referências

- `src/shared/api/instances/index.ts` — `onRequest` (CSRF + módulo) e `onResponseError`.
- `src/shared/api/instances/auth-error.ts` — tratamento global de 401/403.
- `src/app/auth/state.ts` — geração e validação do `state`/nonce.
- `src/app/auth/index.ts` — `signIn` (state) e `signOut` (DELETE /authorization).
- `src/app/providers/router.ts` — validação do `state` no callback.
- `src/shared/utils/cookie.ts` — leitura do cookie de CSRF.
- ADR-0003, ADR-0014 — decisões de autenticação e sessão que esta ADR complementa.
