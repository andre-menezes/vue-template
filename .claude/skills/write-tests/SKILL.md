---
name: write-tests
description: Escreve ou corrige testes deste template — unitários/integração com Vitest + Vue Test Utils (mountWithPlugins, Pinia real) e E2E com Playwright (data-cy, mockUserSession). Use ao cobrir regra nova, bug corrigido ou componente.
---

# Testes (Vitest + Playwright)

Skill de execução para criar ou ajustar testes. Fontes de verdade (em caso de
divergência, valem elas):

- `agent/skills/testing/SKILL.md` — estratégia e padrões
- `src/test/README.md` — organização de `src/test/`, exemplos bons e ruins
- `docs/decisions/ADR-0005-estrategia-de-testes.md` (substituída) e
  `ADR-0020-e2e-com-playwright.md`; cobertura em `ADR-0016`
- `vite.config.ts` (`test.coverage.thresholds`) e `playwright.config.ts`

Antes de escrever, abra **um teste existente do mesmo tipo** e siga o estilo
(ex.: `src/test/components/ShowcaseCard.spec.ts`,
`src/test/services/report.spec.ts`, `src/test/stores/appStore.spec.ts`,
`e2e/onboarding_page.spec.ts`).

## 1. Escolher o tipo de teste

| O que mudou                         | Teste                                    | Onde                          |
| ----------------------------------- | ---------------------------------------- | ----------------------------- |
| Função pura (`shared/utils`)        | Unitário                                 | `src/test/utils/`             |
| Helper / `core` (sessão, config)    | Unitário                                 | `src/test/helpers/`           |
| Service (`shared/api/services`)     | Unitário, mock da instância HTTP         | `src/test/services/`          |
| Instância HTTP / erros 401/403      | Unitário                                 | `src/test/api/`               |
| Store Pinia                         | Unitário, Pinia real                     | `src/test/stores/`            |
| Composable                          | Unitário                                 | `src/test/composables/`       |
| Guard / router                      | Unitário                                 | `src/test/router/`            |
| Componente com lógica, slots, emits | Integração (mount)                       | `src/test/components/`        |
| Lógica própria de módulo (`.ts`)    | Unitário                                 | `src/test/modules/`           |
| Fluxo do usuário numa página        | E2E                                      | `e2e/<contexto>_page.spec.ts` |
| Bug corrigido                       | Regressão: unitário (+ E2E se for fluxo) | conforme a camada             |

Arquivo: `<nome>.spec.ts`. Vitest só coleta `src/test/**/*.spec.ts`.

## 2. Regras para todo teste

- `describe` com o nome da unidade (`'appStore'`, `'CodeBlock'`); `it` em
  **português**, descrevendo o resultado esperado
  (`'copia o código para a área de transferência ao clicar no botão'`).
- Um comportamento por `it`, sempre com `expect` (teste sem assertion é falso positivo).
- Estrutura arrange → act → assert, separada por linha em branco.
- Isolamento: `beforeEach` limpa estado (`setActivePinia(createPinia())`,
  `localStorage.clear()`, `vi.clearAllMocks()`).
- Teste comportamento observável (texto renderizado, emit, retorno, chamada à
  fronteira), não detalhe interno.
- Imports pelos aliases (`@shared/`, `@test/`, `@modules/`...). Importar de
  módulos é permitido em `src/test/`.
- Sem `any`. Para dados parciais de tipos do router etc., siga o padrão
  existente (`as unknown as RouteLocationNormalized` só em fixture de teste).

## 3. Mocks — só fronteiras externas

- **Pinia real** (`createPinia()`); nunca `vi.mock` do módulo de stores.
- Service: mock da instância HTTP, não do `ofetch`:

```ts
import { httpClient } from '@shared/api/instances';

vi.mock('@shared/api/instances', () => ({
  httpClient: { get: vi.fn(), post: vi.fn() },
}));

vi.mocked(httpClient.get).mockResolvedValue(mockCustomers);
expect(httpClient.get).toHaveBeenCalledWith('/customers');
```

- Store/guard que usa service: mock do service
  (`vi.mock('@shared/api/services/auth.service', ...)`), Pinia real.
- APIs de browser sem suporte no happy-dom: stub pontual
  (ver `stubClipboard` em `CodeBlock.spec.ts`). `matchMedia` e `localStorage`
  já estão em `src/test/setup.ts`.
- Dados mockados devem respeitar o contrato real (`@typings/...`).

## 4. Componentes

Monte sempre com `mountWithPlugins` (Pinia + Vuetify + i18n real com `pt-BR.json`):

```ts
import { describe, expect, it } from 'vitest';
import CustomerCard from '@modules/customers/components/CustomerCard.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

describe('CustomerCard', () => {
  it('emite select com o id do cliente ao clicar no botão', async () => {
    const wrapper = mountWithPlugins(CustomerCard, {
      props: { customer: { id: 7, name: 'Maria' } },
    });

    await wrapper.get('[data-cy=customer-select]').trigger('click');

    expect(wrapper.emitted('select')).toEqual([[7]]);
  });
});
```

- Selecione por `[data-cy=...]`; se faltar, adicione o atributo no componente.
- Como o i18n é real, asserte o **texto traduzido** que o usuário vê.
- Slots: `slots: { preview: () => h('span', ...) }` (ver `ShowcaseCard.spec.ts`).
- Ações assíncronas: `await trigger(...)` / `await flushPromises()`.

## 5. E2E (Playwright)

```ts
import { expect, test } from '@playwright/test';
import { mockUserSession } from './support/session';

test.describe('Página Clientes', () => {
  test.describe('com usuário autenticado', () => {
    test.beforeEach(async ({ page }) => {
      await mockUserSession(page);
      await page.goto('/clientes');
    });

    test('lista os clientes retornados pela API', async ({ page }) => {
      await expect(page.getByTestId('customers-page')).toBeVisible();
    });
  });
});
```

- `test.describe` = página/fluxo; `describe` aninhado = cenário; `test` = comportamento (pt-BR).
- Seletores: `page.getByTestId(...)` (o `testIdAttribute` é `data-cy`).
  `getByText` só para validar conteúdo visível. Nada de classe CSS como seletor
  principal.
- Caminhos relativos em `page.goto` (a `baseURL` já está configurada).
- Asserções com espera automática (`await expect(locator)...`); nunca `waitForTimeout`.
- Rota com `meta.requiresAuth`: `mockUserSession(page, overrides?)` **antes** do `goto`.
- Backend: intercepte só endpoints HTTP com `page.route`; não mocke stores.
- O `webServer` sobe o Vite sozinho (porta 9091, modo `test`, auth mock).
  Primeira execução: `npm run test:e2e:install`.

## 6. Rodar e validar

```bash
npm run test                 # unitários
npm run test -- src/test/components/CodeBlock.spec.ts   # um arquivo
npm run test:coverage        # cobertura (CI reprova abaixo do piso)
npm run test:e2e             # E2E headless
```

- Veja o teste **falhar** antes da correção quando for regressão de bug, e
  passar depois.
- Cobertura é um piso que só sobe (ratchet, ADR-0016): se a cobertura medida
  subir, eleve `coverage.thresholds` no `vite.config.ts` — nunca baixe.
- Não deixe teste falhando, pulado (`.skip`/`.only`) ou warning sem investigar.

## Não fazer

- `it` sem `expect`, ou vários comportamentos num `it` só.
- Mock do módulo inteiro de stores ou de `ofetch`.
- Seletor frágil (classe CSS, texto dinâmico) quando cabe `data-cy`.
- `waitForTimeout`, URL absoluta no E2E.
- Testar detalhe de implementação em vez de comportamento.
