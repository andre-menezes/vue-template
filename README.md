# Vue 3 Template - Arquitetura Frontend

Template frontend baseado em Vue 3 + TypeScript + Vite, com foco em:

- separação clara de responsabilidades por camada
- modularização por contexto de domínio
- fluxo de autenticação centralizado no roteador
- padronização de stores, services e tipagem
- qualidade via lint, typecheck, testes unitários/integração e E2E

## Leitura recomendada

- Guia arquitetural completo: [docs/ARCHITECTURE-GUIDE.md](docs/ARCHITECTURE-GUIDE.md)
- Estrutura de código principal: [src/README.md](src/README.md)
- Convenções da camada app: [src/app/README.md](src/app/README.md)
- Convenções de módulos: [src/modules/README.md](src/modules/README.md)
- Convenções compartilhadas: [src/shared/README.md](src/shared/README.md)
- Tipagem e nomenclatura: [src/types/README.md](src/types/README.md)
- Estratégia de testes: [src/test/README.md](src/test/README.md)

## Padrão de documentação

- Todos os arquivos de documentação devem usar codificação UTF-8.
- Ao criar ou editar arquivos `.md`, manter UTF-8 como padrão.

## Stack

- Vue 3 (SFC com script setup)
- TypeScript
- Vite
- Vue Router
- Pinia
- Vuetify
- vue-i18n
- Vitest + Vue Test Utils
- Playwright (E2E)

## Como executar

```bash
npm install
npm run dev
```

## Qualidade e validação

```bash
# Lint
npm run lint

# Typecheck + build
npm run build

# Testes unitários/integração
npm run test

# Cobertura
npm run test:coverage

# E2E (headless)
npm run test:e2e

# E2E (interativo)
npm run test:e2e:open

# Tudo (unitários + E2E)
npm run test:all
```

## Estrutura de alto nível

```text
src/
  app/      # bootstrap, providers, auth, configurações globais, rotas base
  modules/  # módulos de domínio (views, componentes e rotas por contexto)
  shared/   # blocos transversais (api, stores, ui, helpers, utils, composables)
  test/     # setup e suítes de teste (Vitest)
  types/    # contratos TypeScript centralizados por contexto
e2e/        # testes end-to-end (Playwright)
docs/       # documentação arquitetural e guias
```
