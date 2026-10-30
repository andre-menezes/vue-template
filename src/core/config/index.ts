/**
 * config/index.ts
 *
 * Application-wide constants and environment helpers.
 * All `import.meta.env` accesses are centralised here so the rest
 * of the codebase never references env variables directly.
 */

const getEnvVar = (key: keyof AppEnv, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    throw new Error(`[Config Error]: A variável de ambiente ${key} não foi definida.`);
  }
  return value;
};

// Todas têm valor padrão: a aplicação roda sem nenhum arquivo `.env`.
export const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', '/api');
export const APP_NAME = getEnvVar('VITE_APP_NAME', 'Vue Template');
export const DEFAULT_LOCALE = getEnvVar('VITE_APP_DEFAULT_LOCALE', 'pt-BR');

/** Supported locales */
export const SUPPORTED_LOCALES = ['pt-BR'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** localStorage keys (apenas preferências de UX). */
export const STORAGE_KEYS = {
  LOCALE: 'app_locale',
  THEME: 'app_theme',
} as const;

/**
 * `id` do `<main>` dos layouts: alvo do link "Pular para o conteúdo" e do
 * foco movido após cada navegação (ADR-0036).
 */
export const MAIN_CONTENT_ID = 'main-content';

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/** timeouts */
export const HTTP_TIMEOUT_MS = 10_000;
