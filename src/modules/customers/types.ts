/**
 * Contratos do módulo de clientes (exemplo canônico de CRUD).
 *
 * O payload da API e o modelo da UI têm o mesmo formato aqui, então um tipo
 * só serve aos dois. Quando divergirem, separe `CustomerResponse` (API) de
 * `Customer` (UI) e mapeie no service.
 */

/** Cliente como a API devolve e a UI exibe. */
export interface Customer {
  id: number;
  name: string;
  email: string;
  /** Telefone livre, sem máscara; `null` quando não informado. */
  phone: string | null;
  active: boolean;
  /** Data e hora de cadastro em ISO 8601. */
  createdAt: string;
}

/** Campos editáveis de um cliente: corpo do POST e do PUT. */
export interface CustomerParams {
  name: string;
  email: string;
  phone: string | null;
  active: boolean;
}

/**
 * Parâmetros de uma página da listagem. `page` começa em 1.
 *
 * Só este módulo pagina por enquanto; quando um segundo precisar, os tipos de
 * paginação vão para `src/types/services` (roadmap 2.2, ADR-0025).
 */
export interface CustomerListParams {
  page: number;
  pageSize: number;
  /** Filtro por nome ou e-mail; vazio lista todos. */
  search?: string;
}

/** Uma página de resultados e o total de itens que atendem ao filtro. */
export interface PaginatedResponse<TItem> {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
}
