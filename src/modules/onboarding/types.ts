/**
 * Contratos da tela de Onboarding (`/onboarding`).
 */

/** Um passo do guia de criação de feature (exibido no stepper). */
export interface OnboardingStep {
  /** Título curto do passo (ex.: `Criar o módulo`). */
  title: string;
  /** Descrição do que fazer neste passo. */
  description: string;
  /** Código de exemplo do passo. */
  code: string;
  /** Rótulo da linguagem do código (ex.: `ts`, `vue`, `bash`). */
  language: string;
  /** Nome de arquivo opcional do exemplo. */
  filename?: string;
  /** Referência (README) relacionada ao passo. */
  reference?: string;
}

/** Uma pergunta frequente do onboarding. */
export interface OnboardingFaq {
  /** Pergunta. */
  question: string;
  /** Resposta. */
  answer: string;
}
