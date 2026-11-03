import { describe, expect, it } from 'vitest';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@core/config';
import { parseListQuery, toListQuery } from '@modules/customers/list-query';
import { isNotFoundError } from '@modules/customers/errors';

describe('parseListQuery', () => {
  it('usa a primeira página e o tamanho padrão sem query', () => {
    expect(parseListQuery({})).toEqual({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  });

  it('lê página, tamanho e busca (sem espaços nas pontas)', () => {
    expect(parseListQuery({ page: '3', pageSize: '25', search: ' ana ' })).toEqual({
      page: 3,
      pageSize: 25,
      search: 'ana',
    });
  });

  it('ignora valores inválidos e limita o tamanho da página', () => {
    expect(parseListQuery({ page: '-2', pageSize: 'abc', search: '  ' })).toEqual({
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
    expect(parseListQuery({ page: '1.5', pageSize: '5000' }).pageSize).toBe(MAX_PAGE_SIZE);
  });

  it('usa o primeiro valor de um parâmetro repetido', () => {
    expect(parseListQuery({ page: ['2', '9'], search: [null] })).toEqual({
      page: 2,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  });
});

describe('toListQuery', () => {
  it('omite os valores padrão', () => {
    expect(toListQuery({ page: 1, pageSize: DEFAULT_PAGE_SIZE, search: '' })).toEqual({});
  });

  it('escreve o que difere do padrão', () => {
    expect(toListQuery({ page: 2, pageSize: 50, search: 'ana' })).toEqual({
      page: '2',
      pageSize: '50',
      search: 'ana',
    });
  });
});

describe('isNotFoundError', () => {
  it('reconhece só respostas 404', () => {
    expect(isNotFoundError({ status: 404 })).toBe(true);
    expect(isNotFoundError({ status: 500 })).toBe(false);
    expect(isNotFoundError(null)).toBe(false);
    expect(isNotFoundError('404')).toBe(false);
  });
});
