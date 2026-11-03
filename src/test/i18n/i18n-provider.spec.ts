import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '@core/config';

/** Importa o provider do zero: o locale inicial é resolvido no carregamento. */
async function loadProvider() {
  vi.resetModules();
  const provider = await import('@app/providers/i18n');
  // Em modo Composition o locale é um ref; a tipagem do createI18n não reflete
  // isso (mesmo cast usado por `setLocale`).
  const locale = provider.default.global.locale as unknown as { value: string };
  return { ...provider, locale };
}

describe('provider de i18n', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('lang');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.doUnmock('@core/config');
  });

  it('sem preferência salva, inicia no locale padrão da configuração', async () => {
    const { locale } = await loadProvider();

    expect(locale.value).toBe('pt-BR');
    expect(document.documentElement.getAttribute('lang')).toBe('pt-BR');
  });

  it('a preferência salva prevalece sobre o locale padrão da configuração', async () => {
    // O template só traz pt-BR; simula um segundo locale suportado para que
    // o padrão e a preferência salva sejam diferentes.
    vi.doMock('@core/config', async (importOriginal) => ({
      ...(await importOriginal<typeof import('@core/config')>()),
      DEFAULT_LOCALE: 'en-US',
      isSupportedLocale: (value: string | null) => value === 'pt-BR' || value === 'en-US',
    }));
    localStorage.setItem(STORAGE_KEYS.LOCALE, 'pt-BR');

    const { locale } = await loadProvider();

    expect(locale.value).toBe('pt-BR');
    expect(document.documentElement.getAttribute('lang')).toBe('pt-BR');
  });

  it('ignora uma preferência salva que não está entre os locales suportados', async () => {
    localStorage.setItem(STORAGE_KEYS.LOCALE, 'fr-FR');

    const { locale } = await loadProvider();

    expect(locale.value).toBe('pt-BR');
  });

  it('setLocale troca o locale ativo, persiste a escolha e atualiza o <html lang>', async () => {
    const { locale, setLocale } = await loadProvider();
    document.documentElement.setAttribute('lang', 'xx');
    // Simula outro locale ativo (o template só traz pt-BR).
    locale.value = 'xx';

    setLocale('pt-BR');

    expect(locale.value).toBe('pt-BR');
    expect(localStorage.getItem(STORAGE_KEYS.LOCALE)).toBe('pt-BR');
    expect(document.documentElement.getAttribute('lang')).toBe('pt-BR');
  });
});
