/**
 * Contratos da tela de Convenções (`/convencoes`).
 */

/** Tipo de commit do padrão Conventional Commits adotado no projeto. */
export interface CommitType {
  /** Tipo (ex.: `feat`, `fix`). */
  type: string;
  /** Quando usar esse tipo. */
  when: string;
}

/** Escopo de commit — identifica a camada ou módulo afetado. */
export interface CommitScope {
  /** Nome do escopo (ex.: `auth`, `ui`). */
  scope: string;
  /** Exemplos de uso. */
  usage: string;
}

/** Prefixo de nomenclatura de branch. */
export interface BranchType {
  /** Prefixo da branch (ex.: `feat`, `fix`). */
  prefix: string;
  /** Quando usar esse prefixo. */
  when: string;
  /** Exemplo de nome de branch. */
  example: string;
  /** Exemplo ruim de nome de branch. */
  badExample: string;
}

/** Item de uma categoria do checklist de code review. */
export interface ChecklistItem {
  /** Texto do critério. */
  text: string;
  /** Se é bloqueante (⚠️) ou apenas sugestão (💡). */
  blocking: boolean;
}

/** Categoria do checklist de code review (agrupa vários itens). */
export interface ChecklistCategory {
  /** Nome da categoria (ex.: Arquitetura, Tipagem). */
  title: string;
  /** Ícone (ligatura do Material Symbols). */
  icon: string;
  /** Itens da categoria. */
  items: ChecklistItem[];
}

/** Princípio de referência citado no checklist (SRP, DRY, KISS...). */
export interface Principle {
  /** Sigla ou nome curto. */
  name: string;
  /** Descrição do princípio. */
  description: string;
}
