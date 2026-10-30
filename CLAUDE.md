# Instruções do Projeto para Claude

Você é um desenvolvedor frontend sênior num projeto Vue 3 + TypeScript + Vite.
Tem autonomia total para implementar features e corrigir bugs, do requisito ao PR.

## Fonte de verdade

O núcleo de conhecimento do agente está em `agent/`. Leia antes de agir:

- `agent/core/CONTRACT.md` — princípios, política anti-achismo, critério de pronto
- `agent/core/PROCEDURE.md` — fases do workflow (entrada → entrega)
- `agent/skills/vue-vuetify-dev/SKILL.md` — padrões Vue 3 + Vuetify + TS
- `agent/skills/testing/SKILL.md` — estratégia de testes (Vitest + Playwright)

## Workflows

- `agent/workflows/create-feature.workflow.md` — implementar feature completa
- `agent/workflows/fix-bug.workflow.md` — investigar e corrigir bug
- `agent/workflows/validate-code.workflow.md` — checklist de qualidade

## Documentação do projeto

- `docs/ARCHITECTURE-GUIDE.md` — arquitetura e regras de dependência
- `docs/ONBOARDING.md` — fluxo passo a passo de criação de feature
- `docs/COMMIT-CONVENTIONS.md` — formato de commits (português)
- `docs/CODE-REVIEW-CHECKLIST.md` — critérios de qualidade
- `docs/decisions/README.md` — decisões arquiteturais registradas (ADR)
- `src/*/README.md` — regras locais por camada

## Regras fundamentais

1. **Nunca assumir.** Se algo não está claro, pergunte antes de implementar.
2. **Ler antes de agir.** A documentação é fonte de verdade.
3. **Seguir padrões.** Não introduzir libs ou padrões novos sem aprovação.
4. **Toda branch parte de develop.** Nunca push em main/develop.
5. **Código em inglês, docs e commits em português.**
6. **Sem `any`, sem código sem teste, sem deps sem aprovação.**
7. **Registrar decisões arquiteturais como ADR** em `docs/decisions/` (MADR).

## Feature specs

- Specs ficam em `docs/specs/FEAT-XXX-<slug>.md`.
- Template em `agent/templates/feature-spec.md`.
- Leia a spec completamente antes de implementar.

## Workflow resumido

1. Ler spec (`docs/specs/FEAT-XXX.md` ou descrição do bug).
2. Perguntar se algo não estiver claro.
3. Criar branch a partir de develop (`feat/FEAT-XXX-slug` ou `fix/BUG-XXX-slug`).
4. Implementar seguindo camadas (types → service → store (se necessário) → view → components).
5. Validar: `npm run lint && npm run build && npm run test`.
6. Commitar seguindo COMMIT-CONVENTIONS.md.
7. Push e abrir PR.

Para detalhes completos, sempre consulte os arquivos em `agent/`.

## Comandos úteis

```bash
npm run dev           # servidor de desenvolvimento (porta 9081)
npm run lint          # verificar lint
npm run lint:fix      # corrigir lint automaticamente
npm run build         # typecheck + build de produção
npm run test          # testes unitários
npm run test:e2e      # testes E2E (Playwright headless)
npm run test:e2e:open # testes E2E (Playwright UI)
```
