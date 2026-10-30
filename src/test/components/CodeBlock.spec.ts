import { describe, expect, it, vi } from 'vitest';
import CodeBlock from '@shared/ui/components/CodeBlock.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

/** Substitui `navigator.clipboard` por um mock (é um getter read-only no happy-dom). */
function stubClipboard(): ReturnType<typeof vi.fn> {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
  return writeText;
}

describe('CodeBlock', () => {
  it('renderiza o código informado', () => {
    stubClipboard();
    const wrapper = mountWithPlugins(CodeBlock, {
      props: { code: 'pnpm install' },
    });

    expect(wrapper.text()).toContain('pnpm install');
  });

  it('exibe o nome do arquivo e a linguagem no cabeçalho quando informados', () => {
    stubClipboard();
    const wrapper = mountWithPlugins(CodeBlock, {
      props: { code: 'const a = 1;', language: 'ts', filename: 'exemplo.ts' },
    });

    expect(wrapper.text()).toContain('exemplo.ts');
    expect(wrapper.text()).toContain('ts');
  });

  it('copia o código para a área de transferência ao clicar no botão', async () => {
    const writeText = stubClipboard();

    const wrapper = mountWithPlugins(CodeBlock, {
      props: { code: 'pnpm build' },
    });

    await wrapper.get('[data-cy=code-block-copy]').trigger('click');

    expect(writeText).toHaveBeenCalledWith('pnpm build');
  });
});
