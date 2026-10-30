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

const getEnvFlag = (key: string, defaultValue = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined || value === '') return defaultValue;
  return value === 'true' || value === true;
};

// Seg.ID
export const SEGID_BASE_URL = getEnvVar('VITE_SEGID_BASE_URL');
export const SEGID_CLIENT_ID = getEnvVar('VITE_SEGID_CLIENT_ID');
export const SEGID_CONTEXT = getEnvVar('VITE_SEGID_CONTEXT');
export const SEGID_RESPONSE_TYPE = getEnvVar('VITE_SEGID_RESPONSE_TYPE');
export const SEGID_SCOPE = getEnvVar('VITE_SEGID_SCOPE');

export const API_BASE_URL = getEnvVar('VITE_API_BACKEND');
export const AUTH_BACKEND_URL = getEnvVar('VITE_AUTH_BACKEND');
export const APP_NAME = getEnvVar('VITE_APP_NAME');

/**
 * Módulo da aplicação (contexto no SSC). Usado para compor o nome do cookie de
 * CSRF por módulo (`XSRF-TOKEN_<modulo>`) e para o header `x-id-modulo` enviado
 * ao gateway em instâncias multi-módulo (RF-FE-03, RF-FE-06). Cai no
 * `VITE_SEGID_CONTEXT` quando `VITE_APP_MODULO` não é definido.
 */
export const APP_MODULO = getEnvVar('VITE_APP_MODULO', SEGID_CONTEXT);

/**
 * CSRF (double-submit cookie). O backend emite o cookie legível
 * `XSRF-TOKEN_<modulo>`; o frontend o reenvia no header `X-CSRF-Token` nas
 * requisições mutantes (RF-FE-03). Nomes centralizados para não espalhar
 * strings pelo código.
 */
export const CSRF_COOKIE_NAME = `${getEnvVar('VITE_CSRF_COOKIE_PREFIX', 'XSRF-TOKEN')}_${APP_MODULO}`;
export const CSRF_HEADER_NAME = getEnvVar('VITE_CSRF_HEADER_NAME', 'X-CSRF-Token');

/** Header que identifica o módulo da requisição para o gateway (RF-FE-06). */
export const MODULO_HEADER_NAME = 'x-id-modulo';

/**
 * Impede que o mock de autenticação rode em um build de produção: com o mock
 * ativo, qualquer pessoa entra como um usuário fictício com roles reais.
 * Builds de homologação/desenvolvimento (`--mode staging`, `development`)
 * continuam podendo usá-lo. Ver ADR-0017.
 */
export function assertAuthMockAllowed(authMock: boolean, mode: string): void {
  if (authMock && mode === 'production') {
    throw new Error(
      '[Config Error]: VITE_AUTH_MOCK=true não é permitido no modo production. ' +
        'Desligue o mock ou gere o build com --mode staging.'
    );
  }
}

/**
 * Ativa o mock de autenticação (sem SegID real). Útil enquanto o projeto
 * ainda não tem um módulo configurado no SegID. Desligado por padrão
 * (fail-closed): precisa de `VITE_AUTH_MOCK=true` explícito e nunca é aceito
 * no modo `production`.
 */
export const AUTH_MOCK = getEnvFlag('VITE_AUTH_MOCK', false);
assertAuthMockAllowed(AUTH_MOCK, import.meta.env.MODE);
export const DEFAULT_LOCALE = getEnvVar('VITE_APP_DEFAULT_LOCALE');

/** Supported locales */
export const SUPPORTED_LOCALES = ['pt-BR'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * localStorage keys.
 *
 * A sessão de autenticação NÃO usa localStorage: o token vive em um cookie
 * `HttpOnly` emitido pelo backend. Aqui ficam apenas preferências de UX.
 */
export const STORAGE_KEYS = {
  LOCALE: 'app_locale',
  THEME: 'app_theme',
  LAST_ACTIVITY: 'last_activity',
  REDIRECT: 'redirect_after_login',
  /** Nonce do `state` OAuth, gerado no signIn e validado no retorno (RF-FE-06). */
  AUTH_NONCE: 'auth_nonce',
} as const;

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/** timeouts */
export const HTTP_TIMEOUT_MS = 10_000;
