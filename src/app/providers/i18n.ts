/**
 * src/app/providers/i18n.ts
 *
 * Vue i18n configuration.
 *
 * Design decisions:
 * ─ `legacy: false`   — Use Composition API mode exclusively (t() via useI18n()).
 * ─ `globalInjection: true` — Makes $t available in templates without useI18n().
 * ─ Locale is restored from localStorage on boot (STORAGE_KEYS.LOCALE).
 * ─ Falls back to DEFAULT_LOCALE from app config, then to 'pt-BR'.
 * ─ The <html lang> attribute follows the active locale from boot.
 * ─ `missingWarn: false` in production to suppress console noise.
 *
 * @see https://vue-i18n.intlify.dev/
 */
import { createI18n } from 'vue-i18n';
import {
  DEFAULT_LOCALE,
  STORAGE_KEYS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@core/config';
import { ptBRMessages, type MessageSchema } from './messages';

export type { MessageSchema };

/** Resolves the initial locale in priority order:
 *  1. User's persisted preference (localStorage)
 *  2. App default from config (DEFAULT_LOCALE)
 *  3. Hard-coded fallback 'pt-BR'
 */
function resolveInitialLocale(): SupportedLocale {
  const persisted = localStorage.getItem(STORAGE_KEYS.LOCALE) as SupportedLocale;
  if (persisted && SUPPORTED_LOCALES.includes(persisted)) {
    return persisted;
  }
  return (DEFAULT_LOCALE as SupportedLocale) || 'pt-BR';
}

const initialLocale = resolveInitialLocale();

const i18n = createI18n<[MessageSchema], SupportedLocale>({
  legacy: false,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: 'pt-BR',
  messages: {
    'pt-BR': ptBRMessages,
  },
  // Silence missing-key warnings in production using import.meta.env.DEV
  missingWarn: import.meta.env.DEV,
  fallbackWarn: import.meta.env.DEV,
});

document.documentElement.setAttribute('lang', initialLocale);

export default i18n;

/**
 * Changes the active locale and persists the choice.
 * Use this instead of setting i18n.global.locale directly.
 *
 * @example
 * setLocale('pt-BR')
 */
export function setLocale(locale: SupportedLocale): void {
  // In Composition API mode locale is a WritableComputedRef<string>
  (i18n.global.locale as unknown as { value: string }).value = locale;
  localStorage.setItem(STORAGE_KEYS.LOCALE, locale);
  document.documentElement.setAttribute('lang', locale);
}
