# shared/api

Camada de comunicação com backend.

Voltar para o guia geral: [../../../docs/ARCHITECTURE-GUIDE.md](../../../docs/ARCHITECTURE-GUIDE.md)

## Estrutura

- `instances/` — factory HTTP (`createApiInstance`) com interceptadores padrão
- `services/` — funções semânticas por domínio/endpoint

## Padrão de implementação

- A factory (`instances/index.ts`) cuida de cabeçalhos, timeout e tratamento
  transversal (`credentials: 'include'`, CSRF, header de módulo, 401/403).
- Services expõem métodos com nome de negócio técnico (ex: `getUserDataRequest`).
- View/store consome service, nunca chama endpoint diretamente.

## Instâncias disponíveis

| Instância     | Base URL            | Uso                                          |
| ------------- | ------------------- | -------------------------------------------- |
| `httpClient`  | `VITE_API_BACKEND`  | API interna da aplicação                     |
| `authBackend` | `VITE_AUTH_BACKEND` | Sessão BFF (login, dados do usuário, logout) |

Todas são criadas via `createApiInstance(baseURL, options?)` e expõem os métodos:
`get`, `post`, `put`, `patch`, `delete` e `download`.

O tratamento global de `401`/`403` (`instances/auth-error.ts`) vale para todas,
**exceto** `authBackend` (`handleAuthErrors: false`): suas chamadas fazem parte do
próprio fluxo de autenticação, que trata os erros no guard e no logout. Isso
evita login duplicado e loop de redirecionamento (ADR-0017).

## Exemplo de novo service

```ts
// shared/api/services/customer.service.ts
import { httpClient } from '@shared/api/instances';

export interface Customer {
  id: number;
  name: string;
}

export function getCustomersRequest(): Promise<Customer[]> {
  return httpClient.get<Customer[]>('/customers');
}

export function createCustomerRequest(data: Omit<Customer, 'id'>): Promise<Customer> {
  return httpClient.post<Customer>('/customers', { body: data });
}
```

Por que é bom: tipagem genérica no retorno, nome descritivo com sufixo
`Request`, usa a instância compartilhada (DRY), separação clara entre
serviço e componente (SRP).

## Exemplo ruim — chamar endpoint na view

```ts
// RUIM: ofetch direto no componente
import { ofetch } from 'ofetch';

onMounted(async () => {
  const data = await ofetch('/api/customers');
});
```

Por que é ruim: viola separation of concerns (view não deveria conhecer URL
do endpoint), duplica headers/interceptors, impossibilita mock em testes
sem interceptar rede, e espalha chamadas HTTP pelo projeto.

## Exemplo de uso em view container

```ts
import { ref, onMounted } from 'vue';
import { getCustomersRequest } from '@shared/api/services/customer.service';
import type { Customer } from '@shared/api/services/customer.service';

const customers = ref<Customer[]>([]);

onMounted(async () => {
  customers.value = await getCustomersRequest();
});
```

## Assinatura dos métodos

Cada base URL tem **uma** instância do `ofetch`, criada por `createApiInstance`
e reutilizada em todas as chamadas. Todos os métodos recebem `(url, options?)`:

```ts
// GET, DELETE e download — sem corpo
httpClient.get<T, TQuery>(url, { query?, headers?, signal? })
httpClient.delete<T, TQuery>(url, { query?, headers?, signal? })
httpClient.download<TQuery>(url, { query?, headers?, signal? }) // → { blob, contentDisposition }

// POST, PUT, PATCH — aceitam query e/ou body
httpClient.post<T, TQuery, TBody>(url, { query?, body?, headers?, signal? })
httpClient.put<T, TQuery, TBody>(url, { query?, body?, headers?, signal? })
httpClient.patch<T, TQuery, TBody>(url, { query?, body?, headers?, signal? })
```

- `query` aceita qualquer objeto, inclusive uma `interface` de filtro do
  domínio, sem cast.
- `headers` são somados aos da instância (`x-id-modulo` e, nas mutantes, o
  CSRF).
- `signal` cancela a requisição; o timeout padrão (`HTTP_TIMEOUT_MS`) continua
  valendo junto com ele.

## Exemplo com query e body

```ts
// GET com filtro tipado
interface CustomerFilter {
  name?: string;
  page: number;
}
httpClient.get<Customer[], CustomerFilter>('/customers', { query: { page: 1 } });

// POST com body
httpClient.post<User>('/users', { body: { name: 'João' } });

// PUT com query e body
httpClient.put<Item>('/items/1', {
  query: { version: 2 },
  body: { name: 'Atualizado' },
});
```

## Cancelando uma requisição

Use `AbortController` quando o resultado pode ficar obsoleto (busca enquanto o
usuário digita, troca de tela):

```ts
// service
export function searchCustomersRequest(term: string, signal?: AbortSignal) {
  return httpClient.get<Customer[]>('/customers', { query: { term }, signal });
}

// view
let controller: AbortController | undefined;

async function onSearch(term: string) {
  controller?.abort(); // cancela a busca anterior
  controller = new AbortController();
  try {
    customers.value = await searchCustomersRequest(term, controller.signal);
  } catch (error) {
    // Busca cancelada não é erro para o usuário (isAbortError: @shared/utils/http-error).
    if (isAbortError(error)) return;
    throw error;
  }
}

onBeforeUnmount(() => controller?.abort());
```
