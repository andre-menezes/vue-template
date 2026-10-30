/**
 * Contratos da tela de Arquitetura (`/arquitetura`).
 */

/** Uma camada da arquitetura (app, modules, shared, types, test). */
export interface ArchitectureLayer {
  /** Nome da camada (ex.: `app`). */
  name: string;
  /** Descrição da responsabilidade da camada. */
  description: string;
  /** Ícone (ligatura do Material Symbols). */
  icon: string;
  /** Cor do tema associada à camada. */
  color: string;
}

/** Linha da tabela de regras de dependência entre camadas. */
export interface DependencyRule {
  /** Camada de origem. */
  layer: string;
  /** Camadas que ela pode importar. */
  canImport: string;
  /** Camadas que ela não pode importar. */
  cannotImport: string;
}
