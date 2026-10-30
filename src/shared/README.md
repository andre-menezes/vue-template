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
- Autenticação e sessão global devem ficar em `stores` e `helpers`.
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

- Limpar sessão (acessar múltiplas stores).
- Orquestrar chamadas de service + atualização de store.
- Operações com localStorage/sessionStorage que dependem de contexto da app.

### Exemplo — bom código

```ts
// shared/helpers/session.ts
import { STORAGE_KEYS } from '@core/config';
import { useAppStore } from '@shared/stores/app.store';
import { useUserStore } from '@shared/stores/user.store';

export function cleanStorage(): void {
  // Mutação sempre via actions da store.
  useAppStore().setLoading(false);
  useUserStore().setUserData(null);

  localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
}
```

Por que é bom: nome claro sobre o efeito (`clean`), encapsula lógica de
múltiplas stores num único ponto, segue SRP para a responsabilidade de
"limpar sessão".

### Exemplo — mau código

```ts
// RUIM: helper fazendo lógica de formatação (é responsabilidade de utils)
import { useUserStore } from '@shared/stores/user.store';

export function getUserInitials(): string {
  const userStore = useUserStore();
  return (userStore.userData?.nome || 'U').slice(0, 2).toUpperCase();
}
```

Por que é ruim: a lógica de extrair iniciais é pura (recebe string, retorna
string). O acesso à store deveria ficar num composable, e a extração num util:

```ts
// utils/string.ts
export function getInitials(name: string, length = 2): string {
  return name.slice(0, length).toUpperCase();
}

// composables/useSession.ts
const initials = computed(() => getInitials(userName.value || 'U'));
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
// shared/composables/useSession.ts
import { computed } from 'vue';
import { useUserStore } from '@shared/stores/user.store';
import { endSession } from '@shared/helpers/session';

export function useSession() {
  const userStore = useUserStore();

  const isLoggedIn = computed(() => userStore.isAuthorized);
  const userName = computed(() => userStore.userData?.nome ?? '');

  function logout(): Promise<void> {
    return endSession();
  }

  return { isLoggedIn, userName, logout };
}
```

Por que é bom: nome segue convenção `useXxx`, retorna valores reativos e
ações, não expõe a store inteira ao componente (princípio da menor exposição),
facilmente testável com store mockada.

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
