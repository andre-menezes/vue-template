# ADR-0017: Autenticação fail-closed — state obrigatório, erro por código, 401 com autoridade única e mock bloqueado em produção

- **Status:** Aceita
- **Data:** 2026-10-29
- **Decisores:** Time de frontend / Arquitetura
- **Relacionadas:** ADR-0003 (Auth OAuth/SSC no router guard), ADR-0015 (Integração BFF — CSRF, state e logout)

## Contexto e problema

A ADR-0015 introduziu o `state` com nonce e o tratamento global de 401. A
implementação, porém, falhava de forma aberta em quatro pontos:

1. **Login CSRF:** `validarState` aceitava o retorno quando não havia nonce
   salvo. Um link `/token?code=<code_do_atacante>` enviado à vítima trocava o
   code e a logava na conta do atacante.
2. **Mensagem forjável:** o guard repassava texto livre em
   `/erro-autenticacao?msg=...`, exibido com a identidade visual do sistema
   (vetor de phishing/engenharia social).
3. **401 duplicado:** um 401 em chamada do `authBackend` acionava o login no
   guard **e** no interceptor global (gerando um segundo nonce). Se a troca do
   code respondesse 401, o interceptor redirecionava ao SSC enquanto o guard
   enviava à tela de erro — risco de loop.
4. **Mock ligado por padrão:** `VITE_AUTH_MOCK` ausente equivalia a `true`. Um
   projeto que esquecesse a variável publicaria um usuário fictício com roles
   reais.

## Drivers da decisão

- Segurança: na dúvida, negar (fail-closed).
- Uma única autoridade por fluxo de erro de sessão.
- Não alterar contrato com o backend.

## Opções consideradas

- **Manter o fallback do `state` para instalações sem `state`** — descartada:
  todo login iniciado pela aplicação já gera nonce; o fallback só beneficia
  callbacks não iniciados por ela.
- **Exibir o detalhe do erro do backend via `sessionStorage`** — preserva a
  mensagem técnica, mas acrescenta estado; descartada por ora (o detalhe é
  registrado no console).
- **Bloquear o mock em tempo de build (plugin Vite)** vs. **em tempo de carga
  (`@app/config`)** — escolhida a carga: lógica pura e testável, sem
  acoplar o `vite.config.ts` ao código da aplicação.

## Decisão

1. `validarState` retorna `false` quando não há nonce salvo. O `signIn` em modo
   mock também gera o `state`.
2. O guard redireciona para `/erro-autenticacao?reason=<AuthErrorReason>`
   (`state_mismatch` | `token_exchange_failed`). A tela traduz o código via
   i18n; valores desconhecidos exibem a mensagem padrão. O parâmetro `msg`
   deixa de existir.
3. `createApiInstance` recebe `handleAuthErrors`; a instância `authBackend` é
   criada com `false`. Os erros dessas chamadas são tratados pelo guard e pelo
   logout. As demais instâncias mantêm o tratamento global da ADR-0015.
   Esta decisão altera o item 5 da ADR-0015 apenas para o `authBackend`.
4. `VITE_AUTH_MOCK` é `false` quando ausente, e `assertAuthMockAllowed` impede a
   aplicação de iniciar com o mock ativo no modo `production`. Builds de
   homologação devem usar `--mode staging`.

## Consequências

### Positivas

- Fecha o vetor de login CSRF e o de mensagens forjadas.
- Um único fluxo reage a 401 no login, sem nonce sobrescrito nem loop.
- Esquecer a variável de mock não expõe um usuário fictício.

### Negativas / trade-offs

- Um callback do SSC sem login iniciado pela aplicação (ex.: favorito para a
  URL do SSC) cai na tela de erro, que orienta a entrar novamente.
- A tela de erro não mostra mais o detalhe técnico do backend.
- Publicar a documentação do template com mock exige build em `--mode staging`.

### Neutras

- Nova chave i18n `authError.reasons.*` e novo tipo `AuthErrorReason`.

## Referências

- `src/app/auth/state.ts` — `validarState`.
- `src/app/auth/index.ts` — `signIn` (state também no mock).
- `src/app/providers/router.ts` — `authErrorRoute` e guard.
- `src/app/views/AuthErrorView.vue` — tradução do código.
- `src/shared/api/instances/index.ts` — opção `handleAuthErrors`.
- `src/app/config/index.ts` — `AUTH_MOCK` e `assertAuthMockAllowed`.
- `cypress/e2e/auth_flow.cy.ts` — fluxo ponta a ponta.
