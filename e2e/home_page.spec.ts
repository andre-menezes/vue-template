import { expect, test } from '@playwright/test';

/**
 * Home (`/`) — hub de entrada da documentação. Rota pública.
 */
test.describe('Página Home (hub)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('carrega o hub sem exigir autenticação', async ({ page }) => {
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page.getByTestId('home-title')).toContainText('Vue 3 Template');
    await expect(page).toHaveURL('/');
  });

  test('exibe os cartões de navegação da documentação', async ({ page }) => {
    const cards = page.getByTestId('nav-card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(3);
    await expect(page.getByText('Arquitetura').first()).toBeVisible();
    await expect(page.getByText('Onboarding').first()).toBeVisible();
  });

  test('sinaliza a seção autenticada com o selo correspondente', async ({ page }) => {
    await expect(
      page.locator('[data-cy=nav-card][data-cy-route="/exemplo-protegido"]')
    ).toContainText('Autenticada');
  });

  test('exibe o fluxo de trabalho', async ({ page }) => {
    await expect(page.getByText('Fluxo de trabalho').first()).toBeVisible();
  });

  test('navega para a seção de arquitetura ao clicar no cartão', async ({ page }) => {
    await page.locator('[data-cy=nav-card][data-cy-route="/arquitetura"]').click();
    await expect(page).toHaveURL(/\/arquitetura$/);
  });
});
