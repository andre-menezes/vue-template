import { expect, test } from '@playwright/test';
import { mockUserSession } from './support/session';

/**
 * Exemplo autenticado (`/exemplo-protegido`) — única rota com `requiresAuth`.
 */
test.describe('Página Exemplo autenticado (protegida)', () => {
  test.describe('com usuário autenticado', () => {
    test.beforeEach(async ({ page }) => {
      await mockUserSession(page);
      await page.goto('/exemplo-protegido');
    });

    test('libera o acesso à página protegida', async ({ page }) => {
      await expect(page).toHaveURL(/\/exemplo-protegido$/);
      await expect(page.getByTestId('protected-example-page')).toBeVisible();
      await expect(page.getByTestId('protected-example-title')).toContainText(
        'Exemplo autenticado'
      );
    });

    test('exibe os dados do usuário autenticado', async ({ page }) => {
      await expect(page.getByTestId('user-data')).toBeVisible();
    });
  });
});
