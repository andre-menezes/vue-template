/**
 * Contratos da tela de Decisões / ADRs (`/decisoes`).
 */

/** Status do ciclo de vida de uma ADR. */
export type AdrStatus = 'Aceita' | 'Proposta' | 'Substituída' | 'Descontinuada';

/** Uma Architecture Decision Record (ADR) registrada em `docs/decisions/`. */
export interface Adr {
  /** Identificador da ADR (ex.: `ADR-0001`). */
  id: string;
  /** Título da decisão. */
  title: string;
  /** Status atual no ciclo de vida. */
  status: AdrStatus;
  /** Nome do arquivo em `docs/decisions/` (ex.: `ADR-0001-arquitetura-em-camadas.md`). */
  file: string;
}

/** Descrição de um status do ciclo de vida (para a legenda da tela). */
export interface AdrStatusInfo {
  /** Rótulo do status. */
  status: AdrStatus;
  /** Significado do status. */
  meaning: string;
  /** Cor do tema associada. */
  color: string;
}
