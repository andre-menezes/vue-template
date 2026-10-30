# Guia de Onboarding — Como criar uma nova feature

Guia passo a passo para implementar uma funcionalidade completa no projeto,
do módulo ao teste. Siga na ordem e consulte os READMEs específicos para
detalhes de cada camada.

Voltar para o guia geral: [ARCHITECTURE-GUIDE.md](ARCHITECTURE-GUIDE.md)

---

## Pré-requisitos

- Node.js **24.22.2** (versão de referência em `.nvmrc`/`.tool-versions`; o `pnpm install` aceita qualquer 24.x a partir dela — ver o CONTRIBUTING)
- pnpm 10 (`corepack enable` uma vez por máquina; ver o CONTRIBUTING)
- Variáveis de ambiente: opcionais (para sobrescrever os padrões, copie `.env.example` para `.env.development.local`)
- Extensões recomendadas instaladas (veja `.vscode/extensions.json`)

```bash
pnpm install
pnpm dev
```

---

## Passo 1 — Criar o módulo

Crie a pasta do módulo em `src/modules/<nome>/`:

```text
src/modules/customers/
├── routes.ts
├── views/
└── components/
```

### routes.ts

```ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('./views/CustomersView.vue'),
    meta: { nav: { titleKey: 'nav.customers', icon: 'group', order: 70 } },
  },
];

export default routes;
```

A rota é registrada automaticamente pelo router (auto-discovery via glob), e o
`meta.nav` coloca o item no menu lateral, na posição de `order`. Não é
necessário editar nenhum outro arquivo além de criar a chave `nav.customers` no
`pt-BR.json`. Rotas sem `meta.nav` (detalhe, edição) não aparecem no menu.

> Referência: [src/modules/README.md](../src/modules/README.md)

---

## Passo 2 — Criar os tipos

Crie os contratos do domínio em `src/types/<nome>/index.ts`:

```ts
// src/types/customer/index.ts
export interface Customer {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

export interface CreateCustomerParams {
  name: string;
  email: string;
}
```

> Referência: [src/types/README.md](../src/types/README.md)

---

## Passo 3 — Criar o service

Crie as funções de comunicação com backend em `src/shared/api/services/`:

```ts
// src/shared/api/services/customer.service.ts
import { httpClient } from '@shared/api/instances';
import type { Customer, CreateCustomerParams } from '@typings/customer';

export function getCustomersRequest(): Promise<Customer[]> {
  return httpClient.get<Customer[]>('/customers');
}

export function createCustomerRequest(params: CreateCustomerParams): Promise<Customer> {
  return httpClient.post<Customer>('/customers', { body: params });
}
```

> Referência: [src/shared/api/README.md](../src/shared/api/README.md)

---

## Passo 4 — Criar a view container

A view orquestra dados (chama service, controla loading) e passa para
componentes apresentacionais:

```vue
<!-- src/modules/customers/views/CustomersView.vue -->
<template>
  <section class="py-6">
    <h1 class="text-h4 font-weight-bold mb-4">Clientes</h1>
    <CustomerList :customers="customers" :loading="loading" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCustomersRequest } from '@shared/api/services/customer.service';
import type { Customer } from '@typings/customer';
import CustomerList from '../components/CustomerList.vue';

const customers = ref<Customer[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    customers.value = await getCustomersRequest();
  } finally {
    // Sem o finally, um erro deixaria o loading preso em true.
    loading.value = false;
  }
});
</script>
```

> Referência: [src/shared/ui/README.md](../src/shared/ui/README.md) (padrão container vs apresentacional)

---

## Passo 5 — Criar componentes apresentacionais

Componentes puros: recebem props, emitem eventos, sem fetch nem store.

```vue
<!-- src/modules/customers/components/CustomerList.vue -->
<template>
  <v-progress-linear v-if="loading" indeterminate color="primary" />
  <v-list v-else>
    <v-list-item
      v-for="customer in customers"
      :key="customer.id"
      :data-cy="`customer-${customer.id}`"
    >
      <v-list-item-title>{{ customer.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ customer.email }}</v-list-item-subtitle>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import type { Customer } from '@typings/customer';

defineProps<{
  customers: Customer[];
  loading: boolean;
}>();
</script>
```

---

## Passo 6 — Criar testes

### Teste unitário (Vitest)

```ts
// src/test/services/customer.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCustomersRequest } from '@shared/api/services/customer.service';
import { httpClient } from '@shared/api/instances';

vi.mock('@shared/api/instances', () => ({
  httpClient: { get: vi.fn() },
}));

describe('customer service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna lista de clientes', async () => {
    const mockCustomers = [{ id: 1, name: 'Empresa A', email: 'a@a.com', active: true }];
    vi.mocked(httpClient.get).mockResolvedValue(mockCustomers);

    const result = await getCustomersRequest();

    expect(result).toEqual(mockCustomers);
    expect(httpClient.get).toHaveBeenCalledWith('/customers');
  });
});
```

### Teste E2E (Playwright)

```ts
// e2e/customers_page.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Página Clientes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customers');
  });

  test('exibe a lista de clientes', async ({ page }) => {
    const customers = page.locator('[data-cy^="customer-"]');
    await expect(customers.first()).toBeVisible();
  });
});
```

> Referência: [src/test/README.md](../src/test/README.md)

---

## Passo 7 — Validar

Antes de commitar, garanta que tudo passa:

```bash
pnpm lint             # sem erros de lint
pnpm build            # typecheck + build sem erros
pnpm test             # testes unitários passando
```

---

## Checklist de conclusão

- [ ] Módulo criado em `src/modules/<nome>/`
- [ ] `routes.ts` com tipagem `RouteRecordRaw[]` e meta fields
- [ ] Tipos criados em `src/types/<nome>/`
- [ ] Service criado em `src/shared/api/services/`
- [ ] View container orquestrando dados
- [ ] Componentes apresentacionais com props tipadas
- [ ] Teste unitário cobrindo o service
- [ ] Teste E2E cobrindo o fluxo principal
- [ ] `pnpm lint` sem erros
- [ ] `pnpm build` sem erros
- [ ] `pnpm test` passando
- [ ] Commit seguindo [COMMIT-CONVENTIONS.md](COMMIT-CONVENTIONS.md)

---

## Dúvidas frequentes

**Onde colocar lógica reutilizável entre módulos?**
Em `shared/` — se é pura vai em `utils/`, se interage com store/service vai
em `helpers/`, se é reativa vai em `composables/`.

**Preciso criar uma store para minha feature?**
Só se o estado for transversal (usado por outros módulos/componentes) ou
persistente. Estado local de tela fica em `ref`/`reactive` no componente.

**Posso importar de outro módulo?**
Não. Módulos são independentes. Se precisa compartilhar, mova para `shared/`.

**Onde ficam as variáveis de ambiente?**
Sempre em `src/core/config/index.ts` (`@core/config`). Nunca use `import.meta.env` diretamente.
