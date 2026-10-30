/**
 * Funções utilitárias puras de formatação.
 * Não dependem de stores, services ou qualquer camada externa.
 */

/**
 * Formata um valor numérico como moeda brasileira (BRL).
 *
 * @example
 * formatCurrency(1234.5) // 'R$ 1.234,50'
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/** Data sem horário (`YYYY-MM-DD`), que o `Date` interpretaria como UTC. */
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Formata uma data ISO em formato legível pt-BR.
 *
 * Datas sem horário (`2025-03-15`) são tratadas como data local: o `Date`
 * as interpretaria como meia-noite UTC, exibindo o dia anterior em fusos
 * negativos (ex.: 14/03 em UTC-3).
 *
 * @example
 * formatDate('2025-03-15') // '15/03/2025'
 * formatDate('2025-03-15T10:30:00Z') // '15/03/2025'
 */
export function formatDate(isoDate: string): string {
  const dateOnly = DATE_ONLY_PATTERN.exec(isoDate);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(isoDate);

  return new Intl.DateTimeFormat('pt-BR').format(date);
}

/**
 * Trunca um texto com reticências se exceder o limite de caracteres.
 *
 * @example
 * truncate('Hello World', 5) // 'Hello...'
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
