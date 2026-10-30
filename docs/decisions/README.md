# docs/decisions — Architecture Decision Records (ADR)

Registro das decisões arquiteturais do projeto no formato
[MADR](https://adr.github.io/madr/) (Markdown Architectural Decision Records),
com conteúdo em **português**.

Voltar para o guia geral: [../ARCHITECTURE-GUIDE.md](../ARCHITECTURE-GUIDE.md)

## O que é uma ADR

Uma ADR documenta uma decisão arquitetural relevante: o **contexto**, as
**opções consideradas**, a **decisão** tomada e suas **consequências**. Serve
para preservar o "porquê" das escolhas ao longo do tempo, facilitando onboarding
e revisões futuras.

## Quando criar uma ADR

Crie uma ADR quando a decisão:

- introduz ou remove uma biblioteca/ferramenta relevante;
- define ou altera um padrão arquitetural (camadas, fluxo de dados, auth);
- escolhe entre mais de uma abordagem válida;
- estabelece uma convenção transversal que o time deve seguir.

Decisões triviais ou puramente locais **não** precisam de ADR.

## Como criar

1. Copie o template `agent/templates/adr.md`.
2. Renomeie para `docs/decisions/ADR-XXXX-<slug>.md`, usando o próximo número
   sequencial com 4 dígitos (ex.: `ADR-0013-cache-de-requisicoes.md`).
3. Preencha todas as seções e defina o status inicial (`Proposta`).
4. Ao ser aprovada, altere o status para `Aceita`.
5. Adicione a ADR à tabela de índice abaixo.

## Convenção de nomes

- Arquivo: `ADR-XXXX-<slug>.md` (`XXXX` = número com 4 dígitos; `<slug>` em
  kebab-case).
- `ADR-0000-template.md` é um exemplo de preenchimento (não é decisão real).

## Ciclo de status

| Status          | Significado                                       |
| --------------- | ------------------------------------------------- |
| `Proposta`      | Em discussão, ainda não vigente.                  |
| `Aceita`        | Aprovada e em vigor.                              |
| `Substituída`   | Trocada por outra ADR (referenciar a substituta). |
| `Descontinuada` | Não se aplica mais, sem substituta direta.        |

Uma ADR nunca é apagada: para reverter uma decisão, crie uma nova ADR que
substitui a anterior e atualize o status da antiga.

## Índice

| ADR                                                         | Título                                                      | Status        |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ------------- |
| [ADR-0001](ADR-0001-arquitetura-em-camadas.md)              | Arquitetura em camadas e regras de dependência              | Aceita        |
| [ADR-0002](ADR-0002-camada-http-factory-ofetch.md)          | Camada HTTP via factory `createApiInstance` + ofetch        | Aceita        |
| [ADR-0003](ADR-0003-autenticacao-no-router-guard.md)        | Autenticação OAuth centralizada no router guard             | Descontinuada |
| [ADR-0004](ADR-0004-roteamento-auto-discovery.md)           | Roteamento por auto-discovery via `import.meta.glob`        | Aceita        |
| [ADR-0005](ADR-0005-estrategia-de-testes.md)                | Estratégia de testes (Vitest + Vue Test Utils + Cypress)    | Substituída   |
| [ADR-0006](ADR-0006-nucleo-agentico.md)                     | Núcleo de desenvolvimento agêntico em `agent/` com adapters | Aceita        |
| [ADR-0007](ADR-0007-toolchain-eslint-prettier.md)           | Toolchain de qualidade: ESLint flat + Prettier              | Aceita        |
| [ADR-0008](ADR-0008-gestao-versao-node.md)                  | Gestão da versão do Node (22.23.2 + engine-strict + vfox)   | Substituída   |
| [ADR-0009](ADR-0009-estado-e-organizacao-shared.md)         | Padrões de estado e organização do `shared/`                | Aceita        |
| [ADR-0010](ADR-0010-tipagem-e-aliases.md)                   | Tipagem centralizada, aliases e env em `@app/config`        | Aceita        |
| [ADR-0011](ADR-0011-fluxo-de-contribuicao.md)               | Fluxo de contribuição: commits, hooks e CI                  | Aceita        |
| [ADR-0012](ADR-0012-vuetify-como-ui.md)                     | Vuetify 4 como framework de UI                              | Aceita        |
| [ADR-0013](ADR-0013-material-symbols-icones.md)             | Migração de ícones para o Material Symbols                  | Aceita        |
| [ADR-0014](ADR-0014-persistencia-de-sessao-em-cookie.md)    | Persistência de sessão em cookie HttpOnly                   | Descontinuada |
| [ADR-0015](ADR-0015-bff-csrf-state-logout.md)               | Integração BFF — CSRF, state do OAuth e logout no backend   | Descontinuada |
| [ADR-0016](ADR-0016-portoes-de-qualidade-efetivos.md)       | Portões de qualidade efetivos (typecheck, cobertura, env)   | Aceita        |
| [ADR-0017](ADR-0017-autenticacao-fail-closed.md)            | Autenticação fail-closed (state, erro, 401, mock)           | Descontinuada |
| [ADR-0018](ADR-0018-camada-core-e-regras-de-camada.md)      | Camada `core` e regras de camada verificadas pelo ESLint    | Aceita        |
| [ADR-0019](ADR-0019-node-24-lts.md)                         | Atualização do Node para a linha 24 LTS (24.22.2)           | Aceita        |
| [ADR-0020](ADR-0020-e2e-com-playwright.md)                  | Testes E2E com Playwright (substitui o Cypress)             | Aceita        |
| [ADR-0021](ADR-0021-remocao-da-autenticacao-corporativa.md) | Remoção da autenticação corporativa e páginas públicas      | Aceita        |
| [ADR-0022](ADR-0022-github-como-hospedagem-e-ci.md)         | GitHub como hospedagem e CI com GitHub Actions              | Aceita        |
