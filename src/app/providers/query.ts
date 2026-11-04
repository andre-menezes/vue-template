/**
 * TanStack Query (vue-query): cache, deduplicação e estados de requisições
 * assíncronas (ADR-0027).
 *
 * Padrões do template:
 * ─ `staleTime` de 30 s — evita refazer a mesma busca ao navegar entre telas.
 * ─ `retry: 1` — uma nova tentativa; erros 4xx não melhoram com repetição.
 * ─ `refetchOnWindowFocus: false` — sem buscas inesperadas ao trocar de aba.
 *
 * @see https://tanstack.com/query/latest/docs/framework/vue/overview
 */
import { QueryClient, type VueQueryPluginOptions } from '@tanstack/vue-query';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export const queryPluginOptions: VueQueryPluginOptions = {
  queryClient: createQueryClient(),
};
