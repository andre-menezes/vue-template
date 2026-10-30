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

### Removido

- Autenticação corporativa: cliente OAuth, guard de rotas, callback `/token`, tela `/erro-autenticacao`, `user.store`, `useSession`, menu de conta, mock de sessão, tratamento global de 401/CSRF, instância `authBackend` e o módulo `protected-example`. Todas as páginas passam a ser públicas (ADR-0021).
- Variáveis de ambiente do provedor de identidade, do BFF e do CSRF; a URL da API passa a ser `VITE_API_BASE_URL`.
- Pipeline do GitLab (`.gitlab-ci.yml`), templates de merge request/issue e deploy no GitLab Pages (ADR-0022).
- `.env.test`: as variáveis de ambiente têm valores padrão e nenhum arquivo `.env` é obrigatório.
- `package-lock.json` e o campo `allowScripts` do `package.json`, substituídos pelo `pnpm-lock.yaml` e por `pnpm.onlyBuiltDependencies` (ADR-0024).
- Page view do Google Analytics no router e tipos de `src/types/analytics`: nenhum script do gtag era carregado (ADR-0028).

### Alterado

- CI migrado para o GitHub Actions (`.github/workflows/ci.yml`), com templates de issue e PR e labels em `.github/labels.md` (ADR-0022).
- `LICENSE.md` com Andre Menezes como titular.
- Piso de cobertura rebaixado uma única vez após a remoção da autenticação (ADR-0021).
- `engines.node` aceita a linha 24 a partir da `24.22.2` (`>=24.22.2 <25`); a versão exata continua em `.nvmrc` e `.tool-versions` (nota na ADR-0019).
- Regras de camada também bloqueiam import relativo entre módulos (`../../outro-modulo`), com teste em `src/test/architecture` (ADR-0018).
- Versão e contagem de dependências chegam à UI por `define` (`__APP_META__`), e o `package.json` deixou de ir para o bundle.
- Variáveis `VITE_*` tipadas em `src/env.d.ts`; removidos `shims-vue.d.ts` e `.vue` de `resolve.extensions`.
- Fonte de ícones gerada com só o eixo FILL variável (`scripts/build-icon-font.sh`): de 3,96 MB para 458 KB, com todos os ícones (ADR-0023).
- Inter auto-hospedada via `@fontsource-variable/inter`, sem requisição ao Google Fonts (ADR-0023).
- Mensagens de i18n pré-compiladas com `@intlify/unplugin-vue-i18n`, sem o compilador no bundle; regras de lint do vue-i18n ativadas (ADR-0023).
- Variáveis SASS do Vuetify em `src/app/styles/settings.scss` (`styles.configFile`).
- Telas de documentação reunidas no módulo `src/modules/showcase`, com locale próprio e removíveis por `pnpm template:clean`; o hub passou de `/` para `/docs` e `/` virou a página inicial do projeto (ADR-0026).
- Tipos, services, stores e composables usados por um módulo só ficam no próprio módulo (ADR-0025).
- Os exemplos de view da documentação passam a ler dados com `useQuery` num composable do módulo, em vez de `ref` + `onMounted`.
- Menu lateral montado a partir do `meta.nav` das rotas (`titleKey`, `icon`, `order`); criar um módulo não exige mais editar o `TheNavigationMenu`.
- Gerenciador de pacotes migrado do npm para o pnpm: `pnpm-lock.yaml`, `packageManager` no `package.json`, CI com `pnpm install --frozen-lockfile` e documentação com comandos `pnpm` (ADR-0024).
- Lint com informação de tipos (`recommendedTypeChecked` do typescript-eslint) em `src` e `e2e`.
- `mountWithPlugins` usa as factories do app (`createAppVuetify`, `createAppI18n`), com o mesmo tema, ícones e locale.
- Textos coloridos usam os tons `<cor>-text` do tema, com contraste AA; a opacidade de média ênfase do tema claro subiu para 0,7 (ADR-0029).
- `CLAUDE.md` reduzido a um ponteiro para o núcleo `agent/` e os comandos do projeto.
- Piso de cobertura elevado para linhas 38, funções 27, branches 59 e statements 37.
- Menu lateral sem `role=list` sobre links, e bloco de código com `<pre>` focável e tooltip com nome acessível (WCAG, apontados pelo axe).

### Adicionado

- Tratamento global de erros em `@app/providers/errors`: `app.config.errorHandler` e `unhandledrejection` enviam a um `ErrorReporter` trocável (ADR-0028).
- Checagem de acessibilidade WCAG 2.1 A/AA no E2E com `@axe-core/playwright` (`expectNoA11yViolations`) (ADR-0029).
- Testes do `App.vue` (escolha de layout e tema).
- TanStack Query (`@tanstack/vue-query`) para dados do servidor: `QueryClient` em `@app/providers/query`, registrado no bootstrap e no `mountWithPlugins` (ADR-0027).
- Telas de documentação interativa (Vue/Vuetify): Home como hub de navegação, Arquitetura, Onboarding, Componentes & UI, Convenções e Decisões (ADRs).
- Tela de exemplo autenticado (`/exemplo-protegido`), única rota protegida, exibindo os dados do usuário e explicando o guard.
- Rota e tela de erro de autenticação (`/erro-autenticacao`) exibindo a mensagem do parâmetro `msg`.
- Mock de autenticação ativável por `VITE_AUTH_MOCK` (padrão `true`), permitindo usar o template sem o provedor de identidade configurado.
- Extração de mensagens de erro de API no padrão RFC 9457 (`getErrorMessage`) e exemplo na tela de Componentes.
- `ADR-0014` (persistência de sessão em cookie `HttpOnly`) e `docs/I18N-MIGRATION-PLAN.md` (plano de migração para i18n).
- `docs/CREDITS.md` com atribuição das ilustrações (Storyset).
- `CHANGELOG.md` seguindo Keep a Changelog e SemVer.
- `CONTRIBUTING.md` com fluxo de contribuição, convenções e checklist de MR.
- `LICENSE.md` proprietária.
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

- Store `persistent` (sem uso; o tema já era persistido pela `app.store`), instância HTTP do provedor de identidade (sem uso; enviaria cookies e headers ao IdP), `IconVue`, `DependencyCard` e o script `report:chunks` (arquivo inexistente).
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
- URLs de login e logout do provedor de identidade: parâmetros e `redirect_uri` codificados com `URLSearchParams` (um valor com `&` ou `=` não injeta parâmetros) e retorno respeitando o `BASE_URL` quando o app roda em subcaminho.
- Dependências atualizadas para zerar o `npm audit` (12 alertas altos e 4 moderados): `vue` e `@vue/server-renderer` 3.5.44, `vue-i18n` 11.4.16, `vite` 8.2.4, `vitest` e `@vitest/coverage-v8` 4.1.12, `happy-dom` 21.0.4 e dependências transitivas (`brace-expansion`, `js-yaml`, `postcss-selector-parser`, `source-map-js`).

- Testes E2E falhando com "Timed out waiting for your remote page to load": `pageLoadTimeout` ampliado para 120s em `cypress.config.ts` para ambientes com dev server mais lento.
- Ícones do Material Symbols exibidos em tamanho incorreto e prop `size` do `<v-icon>` sem efeito: regras de tamanho (`.v-icon--size-*`) declaradas em `main.scss`, já que o tree-shaking do `vite-plugin-vuetify` não injeta o CSS base do `VIcon`.

---

## [0.0.0] - 2026-08-28

### Adicionado

- Estrutura inicial do template Vue 3 + TypeScript + Vite.
- Arquitetura em camadas (`app`, `modules`, `shared`, `types`, `test`).
- Fluxo de autenticação OAuth centralizado no guard do router.
- Camada HTTP via factory `createApiInstance` (`httpClient` e instância do provedor de identidade).
- Stores Pinia (`app`, `persistent`, `user`) e composables base.
- Módulos de exemplo `home` e `about`.
- Núcleo de desenvolvimento agêntico em `agent/` e adapters por IDE.
- Documentação arquitetural em `docs/` e READMEs por camada.
- Testes unitários (Vitest) e E2E (Cypress).

[Não lançado]: https://github.com/andre-menezes/vue-template/compare/v0.0.0...HEAD
[0.0.0]: https://github.com/andre-menezes/vue-template/releases/tag/v0.0.0
