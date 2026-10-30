---
name: review-code
description: Faz code review de uma branch, PR ou conjunto de arquivos deste template seguindo o CODE-REVIEW-CHECKLIST (bloqueantes ⚠️ vs sugestões 💡, camadas, tipagem, testes, segurança, i18n, a11y, commits). Use quando pedirem revisão, auto-review antes do PR ou auditoria.
---

# Code review do projeto

Revisão orientada pelos critérios do próprio projeto. Fontes de verdade (em
caso de divergência, valem elas):

- `docs/CODE-REVIEW-CHECKLIST.md` — critérios e o que bloqueia
- `agent/workflows/validate-code.workflow.md` — passos e formato do relatório
- `docs/ARCHITECTURE-GUIDE.md` e `docs/decisions/` — regras e o "porquê" delas
- `docs/COMMIT-CONVENTIONS.md` — mensagens de commit

## 1. Definir o escopo

- Sem escopo informado: arquivos alterados na branch atual.
  `git fetch origin develop` (ou a branch base do PR) e
  `git diff --stat origin/develop...HEAD`, depois o diff completo.
- PR informado: leia título, descrição, commits e diff.
- Leia o **arquivo inteiro** em volta de cada trecho alterado, não só o hunk,
  e os READMEs da camada afetada (`src/*/README.md`).

## 2. Rodar os portões automáticos

```bash
npm run lint        # inclui regras de camada (ADR-0018)
npm run typecheck   # vue-tsc -b
npm run test
```

Registre o resultado real de cada um (passou, ou quantos erros e quais). Se
não for possível rodar, diga isso no relatório; não presuma que passaria.
Para mudanças em fluxo de página, considere `npm run test:e2e`.

## 3. Percorrer o checklist

Para cada achado, confirme no código antes de reportar (cite `arquivo:linha`).
Itens ⚠️ bloqueiam o merge; 💡 são sugestões.

**Arquitetura**

- ⚠️ Código na camada correta; módulo não importa de outro módulo; `shared` não
  importa de `modules`/`app`; `core` só importa de `types`; `types` de nada.
- ⚠️ `import.meta.env` só em `@core/config`.
- View é container; componente é apresentacional (sem fetch/store).
- `shared/ui` agnóstico de domínio; lógica reutilizável em `shared`, sem duplicar.
- 💡 Pura → `utils/`; com efeito → `helpers/`; reativa → `composables/`.

**Tipagem**

- ⚠️ Sem `any` em contrato de domínio; ⚠️ `defineProps<T>()`/`defineEmits<T>()`.
- ⚠️ Tipos em `src/types/<contexto>/`, não inline repetido; interface sem `I`.
- Service com generic (`httpClient.get<T>()`), sem `as unknown as`.
- Carga que pode ficar obsoleta repassa `signal` (`AbortController`).
- Contrato de API separado do de UI quando diferem.

**Testes**

- ⚠️ Regra de negócio nova tem teste; ⚠️ todo `it` tem `expect`; ⚠️ suíte verde.
- Bug corrigido tem teste de regressão.
- Pinia real, mock só de fronteira (instância HTTP/service).
- Fluxo crítico (auth) com E2E; seletores `data-cy`.
- Cobertura não caiu; se subiu, `coverage.thresholds` foi elevado (ADR-0016).

**Segurança**

- ⚠️ Nenhum token/segredo/dado pessoal em código, log, template ou URL.
- ⚠️ Nada sensível em `localStorage`; sessão é cookie `HttpOnly` (ADR-0014).
- ⚠️ Input validado antes de ir ao backend.
- Requisições pela instância HTTP (`credentials: 'include'`), nunca `ofetch` direto.
- Autenticação continua fail-closed (ADR-0017); `v-html` sanitizado.

**UI, i18n e acessibilidade**

- Texto de UI via `$t`/`t` com chave em `src/app/locales/pt-BR.json`.
- Cores por token do tema, funcionando em light e dark; ícones Material Symbols.
- `aria-label` em botão só com ícone; ícone decorativo `aria-hidden`; inputs com label.
- `data-cy` nos elementos usados por testes.

**Estilo**

- ⚠️ Lint e build passam. Ordem `<template>` → `<script>` → `<style>`.
- Alias mais curto; eventos em camelCase; sem comentário óbvio.
- Código em inglês; docs, comentários de doc e commits em português.

**Performance**

- Rotas com lazy loading; sem re-fetch/loop desnecessário.
- `computed` para estado derivado em vez de `watch` recalculando.
- 💡 Lista grande com `v-virtual-scroll` ou paginação.

**Commits, PR e documentação**

- ⚠️ Commits em `tipo(escopo): descrição` em português, imperativo, ≤ 72
  chars, sem ponto final (tipos válidos em `scripts/verify-commit-msg.mjs`).
- ⚠️ PR não mistura feature + refactor + docs. Título < 70 chars.
- Decisão arquitetural nova tem ADR; ADRs afetadas atualizadas.
- Mudança relevante registrada em `CHANGELOG.md` (`[Não lançado]`).
- Docs/READMEs afetados atualizados (use a skill `write-docs`).
- Nenhuma dependência nova ou mudança de config de build/lint/tsconfig sem
  aprovação explícita.

## 4. Classificar e reportar

| Situação                                        | Severidade |
| ----------------------------------------------- | ---------- |
| Bug introduzido, teste/lint/build falhando      | ⚠️         |
| Violação de camada, `any` em contrato, segredo  | ⚠️         |
| Regra nova sem teste                            | ⚠️         |
| Nome pouco descritivo, extrair composable, etc. | 💡         |

Seja específico e acionável: o problema, por que importa (cite a regra/ADR) e a
correção sugerida. Não reporte gosto pessoal que não esteja nas convenções.
Use o formato do `validate-code.workflow.md`:

```text
## Resultado da revisão

### Resumo
- Lint: ✅ | ❌ (X erros)
- Type-check: ✅ | ❌ (X erros)
- Testes: ✅ | ❌ (X falhas)
- Arquitetura: ✅ | ❌ (X violações)
- Segurança: ✅ | ❌ (X problemas)
- Decisões (ADR): ✅ | ❌ (X pendências)

### Problemas encontrados
1. ⚠️ [categoria] descrição — arquivo:linha — ação recomendada
2. 💡 [categoria] descrição — arquivo:linha — sugestão

### Conclusão
[Aprovado para merge | Precisa de correções antes de merge]
```

## 5. Depois do relatório

- Só altere código se o usuário pedir; review é diagnóstico.
- Ao corrigir, um commit por responsabilidade (`fix(...)`, `test(...)`,
  `refactor(...)`) e rode os portões de novo.
- Comentário em PR remoto só quando o usuário pedir.
