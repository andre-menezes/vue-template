import { test } from '@playwright/test';
import { expectNoA11yViolations } from '../support/a11y';

const PAGES = ['/docs', '/arquitetura', '/onboarding', '/componentes', '/convencoes', '/decisoes'];

test.describe('Acessibilidade da documentação', () => {
  for (const path of PAGES) {
    test(`${path} não tem violações WCAG A/AA`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expectNoA11yViolations(page);
    });
  }
});
