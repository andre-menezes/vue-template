/**
 * Contratos dos componentes de documentação interativa (camada `shared/ui`).
 * Usados pelas telas que documentam a arquitetura do template.
 */

/** Bloco de código com botão de copiar (sem syntax highlight). */
export interface CodeBlockProps {
  /** Conteúdo do código a ser exibido. */
  code: string;
  /** Rótulo da linguagem exibido no cabeçalho (ex.: `bash`, `ts`, `vue`). */
  language?: string;
  /** Nome de arquivo opcional exibido no cabeçalho do bloco. */
  filename?: string;
}

/** Seção padronizada de documentação (título + descrição + conteúdo em slot). */
export interface DocSectionProps {
  /** Título da seção. */
  title: string;
  /** Descrição curta opcional exibida abaixo do título. */
  description?: string;
  /** Ícone opcional (ligatura do Material Symbols) exibido ao lado do título. */
  icon?: string;
  /** Identificador para âncora de navegação (ex.: `camadas`). */
  anchor?: string;
}

/**
 * Cartão de showcase: apresenta um exemplo vivo (slot `preview`) ao lado do
 * código de uso correspondente.
 */
export interface ShowcaseCardProps {
  /** Título do exemplo. */
  title: string;
  /** Descrição do que o exemplo demonstra. */
  description?: string;
  /** Código de uso exibido no bloco (via CodeBlock). */
  code: string;
  /** Rótulo da linguagem do código. */
  language?: string;
}

/**
 * Cartão de navegação do hub inicial — leva a uma seção da documentação.
 */
export interface NavCard {
  /** Título da seção de destino. */
  title: string;
  /** Descrição curta do que a seção cobre. */
  description: string;
  /** Ícone (ligatura do Material Symbols). */
  icon: string;
  /** Cor do tema (primary, accent, info, warning, success, secondary). */
  color: string;
  /** Rota de destino. */
  route: string;
}

/** Um passo de um fluxo (inicialização, autenticação, rotas) — usado por `FlowSteps`. */
export interface FlowStep {
  /** Ordem/rótulo do passo. */
  order: number;
  /** Título do passo. */
  title: string;
  /** Descrição do que acontece. */
  description: string;
  /** Ícone (ligatura do Material Symbols). */
  icon: string;
}
