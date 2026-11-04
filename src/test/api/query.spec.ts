import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { useQuery } from '@tanstack/vue-query';
import { createQueryClient } from '@app/providers/query';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

describe('createQueryClient', () => {
  it('aplica os padrões do template', () => {
    const queries = createQueryClient().getDefaultOptions().queries;

    expect(queries).toMatchObject({ staleTime: 30_000, retry: 1, refetchOnWindowFocus: false });
  });
});

describe('padrão de busca com useQuery', () => {
  /** Monta um componente que busca dados como uma view de módulo faria. */
  function mountWithQuery(fetcher: (signal: AbortSignal) => Promise<string[]>) {
    const Probe = defineComponent({
      setup() {
        const { data, error, isPending } = useQuery({
          queryKey: ['probe'],
          queryFn: ({ signal }) => fetcher(signal),
        });
        return () =>
          h('p', isPending.value ? 'carregando' : error.value ? 'erro' : data.value?.join(','));
      },
    });
    return mountWithPlugins(Probe);
  }

  it('repassa o signal ao service e expõe os dados', async () => {
    const fetcher = vi.fn().mockResolvedValue(['a', 'b']);
    const wrapper = mountWithQuery(fetcher);

    expect(wrapper.text()).toBe('carregando');
    await flushPromises();

    expect(fetcher).toHaveBeenCalledWith(expect.any(AbortSignal));
    expect(wrapper.text()).toBe('a,b');
  });

  it('expõe o erro sem deixar o loading preso', async () => {
    const wrapper = mountWithQuery(vi.fn().mockRejectedValue(new Error('falhou')));

    await flushPromises();

    expect(wrapper.text()).toBe('erro');
  });
});
