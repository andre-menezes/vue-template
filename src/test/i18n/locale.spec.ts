import { describe, expect, it } from 'vitest';
import { createI18n } from 'vue-i18n';
import ptBR from '@app/locales/pt-BR.json';

/** Lista as chaves-folha do dicionário (ex.: `home.title`). */
function leafKeys(node: unknown, prefix = ''): string[] {
  if (typeof node !== 'object' || node === null) return [prefix];
  return Object.entries(node).flatMap(([key, value]) =>
    leafKeys(value, prefix ? `${prefix}.${key}` : key)
  );
}

describe('locale pt-BR', () => {
  // Caracteres especiais do vue-i18n (ex.: `@` de mensagem vinculada) sem
  // escape quebram a tela em runtime; aqui todas as mensagens são compiladas.
  it('compila todas as mensagens sem erro de sintaxe', () => {
    const errors: string[] = [];
    const i18n = createI18n({
      legacy: false,
      locale: 'pt-BR',
      messages: { 'pt-BR': ptBR },
      missingWarn: false,
      fallbackWarn: false,
    });

    for (const key of leafKeys(ptBR)) {
      try {
        i18n.global.t(key);
      } catch (error) {
        errors.push(`${key}: ${(error as Error).message}`);
      }
    }

    expect(errors).toEqual([]);
  });
});
