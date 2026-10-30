/**
 * config/index.ts
 *
 * Application-wide constants and environment helpers.
 * All `import.meta.env` accesses are centralised here so the rest
 * of the codebase never references env variables directly.
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    throw new Error(`[Config Error]: A variável de ambiente ${key} não foi definida.`);
  }
  return value;
};

export const API_BASE_URL = getEnvVar('VITE_API_BASE_URL');
export const APP_NAME = getEnvVar('VITE_APP_NAME');
export const DEFAULT_LOCALE = getEnvVar('VITE_APP_DEFAULT_LOCALE');

/** Supported locales */
export const SUPPORTED_LOCALES = ['pt-BR'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** localStorage keys (apenas preferências de UX). */
export const STORAGE_KEYS = {
  LOCALE: 'app_locale',
  THEME: 'app_theme',
} as const;

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/** timeouts */
export const HTTP_TIMEOUT_MS = 10_000;
