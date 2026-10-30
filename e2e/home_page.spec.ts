import { expect, test } from '@playwright/test';

/**
 * Home (`/`) — página inicial do projeto. Continua existindo depois do
 * `pnpm template:clean`.
 */
test.describe('Página inicial', () => {
  test('carrega a página inicial', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page.getByTestId('home-title')).toContainText('Bem-vindo');
  });
});
