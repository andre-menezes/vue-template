import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RouterLinkStub } from '@vue/test-utils';
import AuthErrorView from '@app/views/AuthErrorView.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

const route = { query: {} as Record<string, string> };

vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue-router')>()),
  useRoute: () => route,
}));

function mountView() {
  return mountWithPlugins(AuthErrorView, {
    global: { stubs: { RouterLink: RouterLinkStub } },
  });
}

describe('AuthErrorView', () => {
  beforeEach(() => {
    route.query = {};
  });

  it('traduz o código de falha de state', () => {
    route.query = { reason: 'state_mismatch' };

    expect(mountView().get('[data-cy="auth-error-message"]').text()).toContain(
      'Não foi possível validar o retorno do login.'
    );
  });

  it('traduz o código de falha na troca do code', () => {
    route.query = { reason: 'token_exchange_failed' };

    expect(mountView().get('[data-cy="auth-error-message"]').text()).toContain(
      'Não foi possível concluir o login no servidor de autenticação.'
    );
  });

  it('ignora texto livre na URL e exibe a mensagem padrão', () => {
    route.query = { msg: 'Ligue para 0800 000 0000', reason: 'Ligue para 0800 000 0000' };

    const text = mountView().get('[data-cy="auth-error-message"]').text();

    expect(text).toContain('Ocorreu um erro durante a autenticação.');
    expect(text).not.toContain('0800');
  });
});
