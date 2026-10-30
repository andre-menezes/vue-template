/**
 * Parâmetros de query string. Aceita qualquer objeto, inclusive `interface`
 * de filtro do domínio (que não tem assinatura de índice).
 */
export type QueryParams = object;

/** Corpo da requisição: objeto (serializado em JSON) ou `BodyInit` (FormData, Blob...). */
export type BodyParams = object | BodyInit | null;

/** Opções de uma requisição com corpo (`post`, `put`, `patch`). */
export interface RequestOptions<
  TQuery extends QueryParams = QueryParams,
  TBody extends BodyParams = BodyParams,
> {
  /** Parâmetros de query string. */
  query?: TQuery;
  /** Corpo da requisição. */
  body?: TBody;
  /** Headers adicionais desta chamada (somados aos da instância). */
  headers?: HeadersInit;
  /**
   * Cancela a requisição (ex.: ao sair da tela ou ao digitar de novo numa
   * busca). Combinado com o timeout padrão da instância.
   */
  signal?: AbortSignal;
}

/** Opções de uma requisição sem corpo (`get`, `delete`, `download`). */
export type ReadRequestOptions<TQuery extends QueryParams = QueryParams> = Omit<
  RequestOptions<TQuery>,
  'body'
>;

/** Resposta de um download binário: o conteúdo e o cabeçalho de disposição. */
export interface BinaryResponse {
  /** Corpo binário do arquivo. */
  blob: Blob;
  /** Cabeçalho `Content-Disposition` (contém o nome do arquivo, se informado). */
  contentDisposition: string | null;
}
