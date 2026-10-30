import { expect, test } from '@playwright/test';

/**
 * Fluxo de autenticação no callback `/token` e tela de erro (ADR-0017).
 *
 * O `webServer` do Playwright sobe o Vite com `VITE_AUTH_MOCK=true`: o `signIn`
 * mockado volta direto ao `/token` com `code=mock` e um `state`.
 */
test.describe('Fluxo de autenticação', () => {
  test('conclui o login mockado validando o state gerado no signIn', async ({ page }) => {
    await page.goto('/token');

    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('home-page')).toBeVisible();
  });

  test('rejeita link de callback sem state iniciado pela aplicação (login CSRF)', async ({
    page,
  }) => {
    await page.goto('/token?code=code-do-atacante');

    await expect(page).toHaveURL('/erro-autenticacao?reason=state_mismatch');
    await expect(page.getByTestId('auth-error-message')).toContainText(
      'Não foi possível validar o retorno do login.'
    );
  });

  test('não exibe texto livre recebido pela URL na tela de erro', async ({ page }) => {
    await page.goto('/erro-autenticacao?msg=Ligue%20para%200800&reason=Ligue%20para%200800');

    const message = page.getByTestId('auth-error-message');
    await expect(message).toContainText('Ocorreu um erro durante a autenticação.');
    await expect(message).not.toContainText('0800');
  });
});
