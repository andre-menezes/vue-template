/**
 * Estado da listagem na URL (`?page=2&pageSize=25&search=ana`): recarregar a
 * página, voltar no histórico ou compartilhar o link mantém a mesma página e
 * busca. Funções puras, sem router.
 */
import type { LocationQuery, LocationQueryRaw } from 'vue-router';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@core/config';
import type { CustomerListParams } from './types';

/** Primeiro valor de um parâmetro da query (`?a=1&a=2` vira `'1'`). */
function firstValue(value: LocationQuery[string] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

/** Inteiro positivo da query, ou `fallback` quando ausente ou inválido. */
function positiveInt(value: LocationQuery[string] | undefined, fallback: number): number {
  const parsed = Number(firstValue(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/** Lê os parâmetros da listagem da query da rota, com valores padrão. */
export function parseListQuery(query: LocationQuery): CustomerListParams {
  const search = firstValue(query.search).trim();

  return {
    page: positiveInt(query.page, 1),
    pageSize: Math.min(positiveInt(query.pageSize, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE),
    ...(search ? { search } : {}),
  };
}

/** Monta a query da rota, sem os valores padrão (a URL fica curta). */
export function toListQuery({ page, pageSize, search }: CustomerListParams): LocationQueryRaw {
  return {
    ...(page > 1 ? { page: String(page) } : {}),
    ...(pageSize !== DEFAULT_PAGE_SIZE ? { pageSize: String(pageSize) } : {}),
    ...(search ? { search } : {}),
  };
}
