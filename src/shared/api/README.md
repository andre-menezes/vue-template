# shared/api

Camada de comunicação com backend.

Voltar para o guia geral: [../../../docs/ARCHITECTURE-GUIDE.md](../../../docs/ARCHITECTURE-GUIDE.md)

## Estrutura

- `instances/` — factory HTTP (`createApiInstance`) com interceptadores padrão
- `services/` — services usados por mais de um módulo. O service de um módulo
  só fica no próprio módulo, em `modules/<x>/api/` (ADR-0025).

## Padrão de implementação

- A factory (`instances/index.ts`) cuida da base URL, do timeout e do
  cancelamento (`signal`).
- Services expõem métodos com nome de negócio técnico (ex: `downloadReportRequest`).
- A view lê dados por uma query do TanStack Query que chama o service
  (ADR-0027); nunca chama endpoint diretamente.

## Instâncias disponíveis

| Instância    | Base URL            | Uso              |
| ------------ | ------------------- | ---------------- |
| `httpClient` | `VITE_API_BASE_URL` | API da aplicação |

Novas instâncias (ex.: uma API de terceiros) são criadas via
`createApiInstance(baseURL)` e expõem os métodos `get`, `post`, `put`, `patch`,
`delete` e `download`.

Não há tratamento global de autenticação (401/403) nem envio de credenciais:
o template não tem login (ADR-0021). Quando o login próprio existir, esse
tratamento entra na factory.

## Exemplo de novo service

```ts
// modules/customers/api/customer.service.ts
import { httpClient } from '@shared/api/instances';
import type { CreateCustomerParams, Customer } from '../types';

export function getCustomersRequest(options: { signal?: AbortSignal } = {}): Promise<Customer[]> {
  return httpClient.get<Customer[]>('/customers', { signal: options.signal });
}

export function createCustomerRequest(params: CreateCustomerParams): Promise<Customer> {
  return httpClient.post<Customer>('/customers', { body: params });
}
```

O service mora no módulo que o usa. Ele só é promovido para
`shared/api/services/` (e os tipos para `src/types/`) quando um segundo módulo
precisar dele (ADR-0025).

Por que é bom: tipagem genérica no retorno, nome descritivo com sufixo
`Request`, usa a instância compartilhada (DRY), aceita `signal` para
cancelamento e separa serviço e componente (SRP).

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

A view não chama o service direto: um composable do módulo encapsula a query,
que cuida de cache, loading, erro e cancelamento (ADR-0027).

```ts
// modules/customers/composables/useCustomersQuery.ts
import { useQuery } from '@tanstack/vue-query';
import { getCustomersRequest } from '../api/customer.service';

export function useCustomersQuery() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: ({ signal }) => getCustomersRequest({ signal }),
  });
}

// modules/customers/views/CustomersView.vue (<script setup>)
const { data, error, isPending } = useCustomersQuery();
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
- `headers` são enviados junto com a requisição.
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

Numa query, o TanStack Query passa um `signal` ao `queryFn` e aborta a
requisição quando ela deixa de ser necessária (troca de tela ou de chave). Para
uma busca enquanto o usuário digita, coloque o termo na chave: a busca anterior
é cancelada sozinha.

```ts
// service
export function searchCustomersRequest(term: string, signal?: AbortSignal) {
  return httpClient.get<Customer[]>('/customers', { query: { term }, signal });
}

// composable do módulo
export function useCustomerSearchQuery(term: Ref<string>) {
  return useQuery({
    queryKey: ['customers', 'search', term],
    queryFn: ({ signal }) => searchCustomersRequest(term.value, signal),
  });
}
```

Fora de uma query (um download disparado por clique, por exemplo), use um
`AbortController` e chame `controller.abort()` no `onBeforeUnmount`. Uma
requisição cancelada não é erro para o usuário: confira com `isAbortError`
(`@shared/utils/http-error`).
