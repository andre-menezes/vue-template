# Skill: Testes (Vitest + Playwright)

## Objetivo

Criar e manter testes automatizados que garantam a qualidade do código,
prevenindo regressões e validando regras de negócio.

## Ferramentas

| Ferramenta     | Tipo                 | Localização                |
| -------------- | -------------------- | -------------------------- |
| Vitest         | Unitários/integração | `src/test/**/*.spec.ts`    |
| Vue Test Utils | Mount de componentes | `src/test/components/`     |
| happy-dom      | DOM simulado         | Config em `vite.config.ts` |
| Playwright     | End-to-end           | `e2e/**/*.spec.ts`         |

## Quando criar cada tipo

| Cenário                           | Tipo de teste  |
| --------------------------------- | -------------- |
| Regra de negócio (lógica pura)    | Unitário       |
| Service (comunicação HTTP)        | Unitário       |
| Store (state + actions)           | Unitário       |
| Guard de rota (auth)              | Unitário       |
| Componente com lógica (computeds) | Integração     |
| Fluxo completo do usuário         | E2E            |
| Regressão de bug corrigido        | Unitário + E2E |

## Padrões — Teste unitário

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAppStore } from '@shared/stores/app.store';

describe('appStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('alterna o tema de light para dark', () => {
    const store = useAppStore();

    store.switchTheme();

    expect(store.theme).toBe('dark');
    expect(localStorage.getItem('app_theme')).toBe('dark');
  });
});
```

### Regras

- `beforeEach` limpa estado (isolamento entre testes).
- Pinia real com `createPinia()` (nunca mock completo da store).
- Mock apenas do que é externo (HTTP, APIs de browser).
- Cada `it` testa **um** comportamento.
- Nome do `it` em português, descrevendo o resultado esperado.
- Assertion obrigatória (nunca `it` vazio).

## Padrões — Mock de service

```ts
import { httpClient } from '@shared/api/instances';

vi.mock('@shared/api/instances', () => ({
  httpClient: { get: vi.fn(), post: vi.fn() },
}));

// No teste:
vi.mocked(httpClient.get).mockResolvedValue(mockData);
```

- Mock apenas a instância HTTP (não o módulo inteiro de stores).
- Dados mockados representativos do contrato real.

## Padrões — Teste E2E (Playwright)

O `webServer` do `playwright.config.ts` sobe o Vite (porta 9091, modo `test`,
mock de auth ligado); não é preciso rodar `npm run dev` antes. Na primeira
execução, instale o navegador com `npm run test:e2e:install`.

### Rota pública

```ts
import { expect, test } from '@playwright/test';

test.describe('Página Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('carrega a página inicial sem exigir autenticação', async ({ page }) => {
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page.getByTestId('home-title')).toContainText('Vue 3 Template');
  });
});
```

### Rota protegida (`meta.requiresAuth`)

Use o helper `mockUserSession(page)` (`e2e/support/session.ts`) antes do
`goto`. A sessão usa um cookie `HttpOnly` do backend; o helper intercepta
`GET /auth-backend/authorization/user` para simular a sessão válida.

```ts
import { expect, test } from '@playwright/test';
import { mockUserSession } from './support/session';

test.describe('Página Exemplo autenticado (protegida)', () => {
  test.describe('com usuário autenticado', () => {
    test.beforeEach(async ({ page }) => {
      await mockUserSession(page);
      await page.goto('/exemplo-protegido');
    });

    test('libera o acesso à página protegida', async ({ page }) => {
      await expect(page.getByTestId('protected-example-page')).toBeVisible();
    });
  });
});
```

`mockUserSession(page, overrides?)` aceita sobrescrever campos do usuário
mockado: `mockUserSession(page, { nomeUsuario: 'Maria Souza' })`.

### Regras

- Seletores via `data-cy` com `page.getByTestId(...)` (o `testIdAttribute` é
  `data-cy`); nunca classes CSS ou texto que pode mudar. Reserve `getByText`
  para validar conteúdo textual visível.
- `test.describe` = página/fluxo; `test.describe` aninhado = cenário;
  `test` = comportamento (pt-BR).
- Use caminhos relativos (`page.goto('/exemplo-protegido')`) — a `baseURL` já está definida.
- Use asserções com espera automática (`await expect(locator).toBeVisible()`),
  nunca `waitForTimeout`.
- Não mocke stores — o E2E testa o sistema integrado. Intercepte apenas as
  fronteiras externas (endpoints HTTP) com `page.route`.
- Rotas protegidas: sempre `mockUserSession(page)` antes do `goto`.

## Atributos data-cy

Adicione nos componentes para seletores estáveis:

```vue
<v-btn data-cy="submit-btn" @click="submit">Enviar</v-btn>
<v-list data-cy="customer-list">
  <v-list-item
    v-for="customer in customers"
    :key="customer.id"
    :data-cy="`customer-${customer.id}`"
  />
</v-list>
```

## Thresholds de cobertura

| Métrica    | Mínimo |
| ---------- | ------ |
| Lines      | 45%    |
| Functions  | 29%    |
| Branches   | 57%    |
| Statements | 43%    |

Os valores são um **piso que só sobe** (ratchet — ADR-0016): refletem a
cobertura real medida e devem ser elevados em `vite.config.ts` sempre que a
cobertura aumentar. A fonte de verdade é o `coverage.thresholds` do
`vite.config.ts`.

## Comandos

```bash
npm run test              # unitários (single run)
npm run test:watch        # unitários (watch mode)
npm run test:coverage     # cobertura com relatório
npm run test:e2e          # E2E headless
npm run test:e2e:open     # E2E interativo
npm run test:all          # unitários + E2E
```

## Não fazer

- Não criar teste sem assertion (falso positivo).
- Não mockar módulo inteiro de stores (esconde breaking changes).
- Não usar seletores frágeis (classes CSS, texto dinâmico).
- Não testar implementação interna (teste comportamento observável).
- Não deixar teste falhando no PR.
- Não tratar warning como aceitável sem investigar.
