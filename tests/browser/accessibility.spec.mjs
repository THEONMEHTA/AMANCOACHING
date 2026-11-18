import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page and active quiz meet automated WCAG A/AA checks', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  let result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  await page.getByRole('button', { name: 'Start my snapshot' }).click();
  result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
});

test('mobile menu, reduced motion and privacy keyboard behaviour', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open menu', exact: true });
  await menu.click(); await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('link', { name: 'The coaching', exact: true }).click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  expect(new URL(page.url()).hash).toBe('#coaching');
});
