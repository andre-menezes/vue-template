import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatCurrency, formatDate, truncate } from '@shared/utils/format';

describe('formatDate', () => {
  beforeEach(() => {
    // Fuso negativo (UTC-3), onde a data sem horário regredia um dia.
    vi.stubEnv('TZ', 'America/Sao_Paulo');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('mantém o dia de uma data sem horário (sem deslocar por UTC)', () => {
    expect(formatDate('2025-03-15')).toBe('15/03/2025');
  });

  it('formata uma data ISO com horário', () => {
    expect(formatDate('2025-03-15T10:30:00-03:00')).toBe('15/03/2025');
  });
});

describe('formatCurrency', () => {
  it('formata em reais', () => {
    // Intl usa espaço não separável entre o símbolo e o valor.
    expect(formatCurrency(1234.5).replace(/\s/g, ' ')).toBe('R$ 1.234,50');
  });
});

describe('truncate', () => {
  it('mantém textos dentro do limite', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('trunca com reticências acima do limite', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });
});
