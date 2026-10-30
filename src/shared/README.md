# shared

Camada de recursos compartilhados entre módulos.

Voltar para o guia geral: [../../docs/ARCHITECTURE-GUIDE.md](../../docs/ARCHITECTURE-GUIDE.md)

## Objetivo

Evitar duplicação e padronizar infraestrutura transversal. Tudo que é
reutilizado por dois ou mais módulos pertence a esta camada.

## Subpastas

| Pasta          | Responsabilidade                                                      |
| -------------- | --------------------------------------------------------------------- |
| `api/`         | Instâncias HTTP (factory) e services semânticos                       |
| `composables/` | Lógica reativa compartilhada entre componentes (`useXxx`)             |
| `helpers/`     | Funções que interagem com stores, services ou APIs com efeito lateral |
| `stores/`      | Estado global (Pinia)                                                 |
| `ui/`          | Layouts, componentes globais e ícones                                 |
| `utils/`       | Funções puras — recebem dado, processam, retornam resultado           |
| `assets/`      | Arquivos estáticos compartilhados (SVG, imagens)                      |

## Regras gerais

- Integração com backend deve ficar em `api/services`.
- Estado global deve ficar em `stores`; efeitos que orquestram stores/services, em `helpers`.
- Componentes de UI compartilhada devem ser agnósticos de contexto.
- Nunca importar de `modules/` dentro de `shared/`.

---

## utils — Funções puras

Funções que **não conhecem nenhuma camada** da aplicação. Recebem parâmetros
de entrada, processam e retornam um resultado. Sem efeito colateral, sem
dependência de stores, services ou APIs do browser que alterem estado.

### Quando usar

- Formatação de dados (moeda, data, texto).
- Cálculos, validações, transformações.
- Qualquer lógica 100% testável em isolamento.

### Exemplo — bom código

```ts
// shared/utils/format.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
```

Por que é bom: função pura, sem dependência externa, facilmente testável,
nome descritivo, retorno previsível para qualquer entrada.

### Exemplo — mau código

```ts
// RUIM: acessa store dentro de uma "util"
import { useAppStore } from '@shared/stores/app.store';

export function getFormattedTheme(): string {
  const store = useAppStore();
  return store.theme === 'dark' ? 'Escuro' : 'Claro';
}
```

Por que é ruim: viola o princípio de função pura. Depende de estado externo
(store), impossibilita testes unitários sem mock, e pertence a `helpers/` ou
a um `composable`.

---

## helpers — Funções com efeito lateral

Funções que **interagem com camadas externas**: stores, services, localStorage,
sessionStorage, APIs do browser. Podem ler e alterar estado global.

### Quando usar

- Disparar efeitos no navegador a partir de dados de um service (ex.: download).
- Orquestrar chamadas de service + atualização de store.
- Operações com localStorage/sessionStorage que dependem de contexto da app.

### Exemplo — bom código

```ts
// shared/helpers/file-download.ts
import { saveBinaryResponse } from '@shared/utils/file-download';
import type { BinaryResponse } from '@typings/services';

export async function downloadAndSave(request: Promise<BinaryResponse>): Promise<void> {
  const { blob, contentDisposition } = await request;
  saveBinaryResponse(blob, contentDisposition);
}
```

Por que é bom: nome claro sobre o efeito, orquestra o service (rede) e o
salvamento no navegador (utils) num único ponto e não contém lógica pura que
deveria estar em `utils`.

### Exemplo — mau código

```ts
// RUIM: helper fazendo lógica de formatação (é responsabilidade de utils)
import { useAppStore } from '@shared/stores/app.store';

export function getThemeLabel(): string {
  const appStore = useAppStore();
  return appStore.theme === 'dark' ? 'Tema escuro' : 'Tema claro';
}
```

Por que é ruim: a tradução do nome do tema em rótulo é pura (recebe valor,
retorna string). O acesso à store deveria ficar num composable, e a conversão
num util:

```ts
// utils/theme.ts
export function toThemeLabel(theme: ThemeName): string {
  return theme === 'dark' ? 'Tema escuro' : 'Tema claro';
}

// composables/useTheme.ts
const label = computed(() => toThemeLabel(appStore.theme));
```

---

## composables — Lógica reativa compartilhada

Funções `useXxx` que retornam **estado reativo** (refs, computeds) e/ou
**ações**. São o ponto de entrada para componentes consumirem lógica de
negócio sem acoplar diretamente às stores.

### Quando usar

- Expor estado derivado (computed) a partir de stores.
- Encapsular lógica de negócio reativa reutilizada em vários componentes.
- Abstrair complexidade de múltiplas stores num contrato simples.

### Exemplo — bom código

```ts
// shared/composables/useTheme.ts
import { computed } from 'vue';
import { useAppStore } from '@shared/stores/app.store';
import type { ThemeName } from '@typings/theme';

export function useTheme() {
  const appStore = useAppStore();

  const theme = computed<ThemeName>(() => appStore.theme);
  const isDark = computed(() => appStore.theme === 'dark');

  function toggleTheme(): void {
    appStore.switchTheme();
  }

  return { theme, isDark, toggleTheme };
}
```

Por que é bom: nome segue convenção `useXxx`, retorna valores reativos e
ações, não expõe a store inteira ao componente (princípio da menor exposição),
facilmente testável com Pinia real.

### Exemplo — mau código

```ts
// RUIM: composable que faz fetch direto (responsabilidade de service)
import { ref } from 'vue';
import { ofetch } from 'ofetch';

export function useUsers() {
  const users = ref([]);

  async function load() {
    users.value = await ofetch('/api/users');
  }

  return { users, load };
}
```

Por que é ruim: viola separation of concerns. O fetch direto no composable
acopla a camada de apresentação ao HTTP. O correto é chamar um service e o
composable orquestra stores:

```ts
// shared/api/services/user.service.ts
export function getUsersRequest() {
  return httpClient.get<User[]>('/users');
}

// shared/composables/useUsers.ts
import { ref } from 'vue';
import { getUsersRequest } from '@shared/api/services/user.service';

export function useUsers() {
  const users = ref<User[]>([]);

  async function load() {
    users.value = await getUsersRequest();
  }

  return { users, load };
}
```

---

## Resumo: onde colocar o quê

| Precisa de store/service? | É reativo (ref/computed)? | Vai para       |
| ------------------------- | ------------------------- | -------------- |
| Não                       | Não                       | `utils/`       |
| Sim                       | Não                       | `helpers/`     |
| Sim                       | Sim                       | `composables/` |
