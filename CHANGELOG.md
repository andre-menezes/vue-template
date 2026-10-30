# Changelog

Todas as mudanças relevantes deste projeto são documentadas neste arquivo.

O formato segue o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## Tipos de mudança

- **Adicionado** — para novas funcionalidades.
- **Alterado** — para mudanças em funcionalidades existentes.
- **Descontinuado** — para funcionalidades que serão removidas em breve.
- **Removido** — para funcionalidades removidas.
- **Corrigido** — para correção de bugs.
- **Segurança** — em caso de vulnerabilidades.

---

## [Não lançado]

### Adicionado

- Skills do Claude Code em `.claude/skills/` (`vue-vuetify-components`, `write-tests`, `review-code`, `write-docs`) e skill de documentação no núcleo agêntico (`agent/skills/documentation/`).
- Telas de documentação interativa (Vue/Vuetify): Home como hub de navegação, Arquitetura, Onboarding, Componentes & UI, Convenções e Decisões (ADRs).
- Tela de exemplo autenticado (`/exemplo-protegido`), única rota protegida, exibindo os dados do usuário e explicando o guard.
- Rota e tela de erro de autenticação (`/erro-autenticacao`) exibindo a mensagem do parâmetro `msg`.
- Mock de autenticação ativável por `VITE_AUTH_MOCK` (padrão `true`), permitindo usar o template sem um módulo configurado no SegID.
- Extração de mensagens de erro de API no padrão RFC 9457 (`getErrorMessage`) e exemplo na tela de Componentes.
- `ADR-0014` (persistência de sessão em cookie `HttpOnly`) e `docs/I18N-MIGRATION-PLAN.md` (plano de migração para i18n).
- `docs/CREDITS.md` com atribuição das ilustrações (Storyset).
- `CHANGELOG.md` seguindo Keep a Changelog e SemVer.
- `CONTRIBUTING.md` com fluxo de contribuição, convenções e checklist de MR.
- `LICENSE.md` proprietária (PRODEMGE).
- `.nvmrc` e `.tool-versions` travando a versão do Node.js em `22.23.2` (LTS) e campo `engines` no `package.json`.
- Recomendação de uso do vfox para gerenciar a versão do Node.js (CONTRIBUTING.md).
- `engine-strict=true` no `.npmrc`: o `npm install` falha se o Node não for `22.23.2`.
- Git hooks com Husky + lint-staged (pre-commit e commit-msg validando Conventional Commits).
- Pipeline de CI para GitLab (`.gitlab-ci.yml`): install, lint, build e testes com cobertura.
- Templates de Merge Request e Issue do GitLab, com labels padronizadas.
- Architecture Decision Records (ADR) em `docs/decisions/` (formato MADR, em português): template, índice e 12 decisões arquiteturais retroativas.
- Integração das ADRs ao núcleo agêntico (`agent/`) e aos adapters de IDE, para que decisões futuras gerem registros.
- Testes E2E (Cypress) para as páginas Home (pública) e Exemplo autenticado (protegida), com o comando `cy.userLogin` para mockar sessão.
- Conjunto de ícones **Material Symbols** (pacote `material-symbols`) via icon set customizado do Vuetify (`ADR-0013`).
- `.env.test` versionado com valores fictícios: a suíte unitária roda sem configuração local e sem cópia do `.env.example` no CI (ADR-0016).
- `ADR-0016` (portões de qualidade efetivos) e `ADR-0017` (autenticação fail-closed).
- Teste E2E do fluxo de autenticação (`auth_flow.cy.ts`).
- Camada `src/core` (alias `@core`) com `config` e o cliente OAuth, e regras de dependência entre camadas verificadas pelo ESLint (`ADR-0018`).
- Tipagem de `RouteMeta` (`requiresAuth`, `layout`) via augmentation do vue-router.
- Índice de ADRs da tela de Decisões gerado a partir de `docs/decisions/*.md`.

### Alterado

- Ícones migrados de Material Design Icons (`mdi-*`) para Material Symbols (ligaturas, ex.: `settings`).
- Autenticação: sessão persistida em cookie `HttpOnly` emitido pelo backend; requisições usam `credentials: 'include'` e o cliente não gerencia mais o token (ADR-0014).
- Rolagem suave ao topo na troca de rota (`scrollBehavior` do router).
- `@app/config` e `@app/auth` movidos para `@core/config` e `@core/auth`; login/logout passam por `startLogin`/`endSession` (`@shared/helpers/session`) e `useSession` (ADR-0018).
- Adapters de IDE (`.cursorrules`, Copilot, Kiro) viram ponteiros para `agent/` e `docs/`, sem regras duplicadas.
- Nomes de rota padronizados em PascalCase/inglês (`Components`, `Conventions`, `Decisions`, `ProtectedExample`).
- `vue-i18n` movido para `dependencies` (é dependência de runtime).
- O logout não redefine mais o tema escolhido pelo usuário.
- Node.js atualizado de `22.23.2` para `24.22.2` (linha 24 LTS) em `.nvmrc`, `.tool-versions`, `engines` e na imagem do CI (ADR-0019, substitui a ADR-0008).
- Testes E2E migrados do Cypress para o Playwright (`e2e/**/*.spec.ts`, Chromium): o `webServer` sobe o Vite na porta 9091 no modo `test` com o mock de auth ligado, e o CI ganha o job `e2e` (ADR-0020, substitui a ADR-0005).
- Cliente HTTP (`createApiInstance`): uma instância do ofetch por base URL (antes, uma por requisição), sem casts `as unknown as`, e todos os métodos com `(url, { query?, body?, headers?, signal? })`. **Quebra de compatibilidade:** `get`, `delete` e `download` deixam de receber os parâmetros de query como segundo argumento — use `{ query }`. O `signal` cancela a requisição junto com o timeout padrão; `isAbortError` (`@shared/utils/http-error`) identifica o cancelamento. Um download sem conteúdo binário passa a falhar em vez de devolver um blob vazio.

### Removido

- Store `persistent` (sem uso; o tema já era persistido pela `app.store`), instância HTTP `segID` (sem uso; enviaria cookies e headers ao IdP), `IconVue`, `DependencyCard` e o script `report:chunks` (arquivo inexistente).
- `docs/JENKINS-OPTIMIZATION.md` (documento de outro projeto).

- Parâmetro `msg` da tela `/erro-autenticacao`: substituído por `reason` com código traduzido via i18n (ADR-0017).
- Módulo `about` (substituído pela tela de exemplo autenticado).
- Persistência de token em `localStorage` (substituída pelo cookie de sessão).
- Dependência `@mdi/font` (substituída pelo Material Symbols).

### Corrigido

- Botão de menu no mobile não abria a navegação (evento do header não era tratado pelo layout); o drawer usa breakpoints reativos.
- `formatDate` exibia o dia anterior para datas sem horário em fusos negativos.
- `parseContentDisposition` truncava nomes de arquivo com espaços.
- Favicon apontava para arquivo inexistente; `<html lang>` agora é `pt-BR` e segue o locale ativo.
- Documentação divergente do código (módulo `about`, tokens no cliente, regra de camada invertida na skill, tipos de commit, ordem das camadas, endpoint de usuário no guia de testes).

- `npm run build`/`typecheck` não verificavam nenhum arquivo (`vue-tsc --noEmit` sobre o tsconfig de solução); agora usam `vue-tsc -b` (ADR-0016).
- Gate de cobertura inerte (`coverage.include` vazio): passa a medir `src/` com piso ratchet igual à cobertura real (ADR-0016).
- Teste de `signOut` que disparava requisição HTTP real.
- CI passa a usar `npm ci`.

### Segurança

- Login CSRF: o callback `/token` rejeita o `code` quando não há nonce salvo (ADR-0017).
- Tela de erro de autenticação não exibe mais texto livre recebido pela URL (ADR-0017).
- Erros 401 do `authBackend` não acionam mais o login global, eliminando login duplicado e risco de loop (ADR-0017).
- `VITE_AUTH_MOCK` passa a ser `false` quando ausente e é bloqueado no modo `production` (ADR-0017).
- URLs de login e logout do SSC: parâmetros e `redirect_uri` codificados com `URLSearchParams` (um valor com `&` ou `=` não injeta parâmetros) e retorno respeitando o `BASE_URL` quando o app roda em subcaminho.
- Dependências atualizadas para zerar o `npm audit` (12 alertas altos e 4 moderados): `vue` e `@vue/server-renderer` 3.5.44, `vue-i18n` 11.4.16, `vite` 8.2.4, `vitest` e `@vitest/coverage-v8` 4.1.12, `happy-dom` 21.0.4 e dependências transitivas (`brace-expansion`, `js-yaml`, `postcss-selector-parser`, `source-map-js`).

- Testes E2E falhando com "Timed out waiting for your remote page to load": `pageLoadTimeout` ampliado para 120s em `cypress.config.ts` para ambientes com dev server mais lento.
- Ícones do Material Symbols exibidos em tamanho incorreto e prop `size` do `<v-icon>` sem efeito: regras de tamanho (`.v-icon--size-*`) declaradas em `main.scss`, já que o tree-shaking do `vite-plugin-vuetify` não injeta o CSS base do `VIcon`.

---

## [0.0.0] - 2026-08-28

### Adicionado

- Estrutura inicial do template Vue 3 + TypeScript + Vite.
- Arquitetura em camadas (`app`, `modules`, `shared`, `types`, `test`).
- Fluxo de autenticação OAuth/SSC centralizado no guard do router.
- Camada HTTP via factory `createApiInstance` (`httpClient` e `segID`).
- Stores Pinia (`app`, `persistent`, `user`) e composables base.
- Módulos de exemplo `home` e `about`.
- Núcleo de desenvolvimento agêntico em `agent/` e adapters por IDE.
- Documentação arquitetural em `docs/` e READMEs por camada.
- Testes unitários (Vitest) e E2E (Cypress).

[Não lançado]: https://git.prodemge.gov.br/arquitetura-see/geral/frontend/vue-template/-/compare/v0.0.0...HEAD
[0.0.0]: https://git.prodemge.gov.br/arquitetura-see/geral/frontend/vue-template/-/tags/v0.0.0
