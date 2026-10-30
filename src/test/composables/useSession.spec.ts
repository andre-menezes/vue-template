import { describe, expect, it } from 'vitest';
import { getInitials } from '@shared/composables/useSession';

describe('getInitials', () => {
  it('usa a primeira letra do primeiro e do último nome', () => {
    expect(getInitials('Maria da Silva')).toBe('MS');
  });

  it('usa uma letra para nome único', () => {
    expect(getInitials('maria')).toBe('M');
  });

  it('ignora espaços extras', () => {
    expect(getInitials('  Ana   Souza ')).toBe('AS');
  });

  it('retorna U para nome vazio', () => {
    expect(getInitials('')).toBe('U');
  });
});
