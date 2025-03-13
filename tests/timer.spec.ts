import { test, expect } from '@playwright/test';

test.describe('initial state', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  test('default timer', async ({ page }) => {
    await expect(page.getByRole('timer')).toContainText('45:00');
  });
  test('default timer - accessible name', async ({ page }) => {
    await expect(page.getByRole('timer')).toContainText('45 minutes left');
  });
  test('cycle list', async ({ page }) => {
    const list = page.getByRole('list', { name: 'Intervals' });
    await expect(list.getByRole('listitem')).toHaveCount(1);
    await expect(list.getByRole('listitem')).toContainText('W');
    await expect(list.getByRole('listitem')).toContainText('45:00');
  });

  test('controls', async ({ page }) => {
    const controls = page.getByRole('group', { name: 'Timer controls' });
    await expect(controls.getByRole('button', { name: 'Play' })).toBeVisible();
    await expect(controls.getByRole('button', { name: 'Skip' })).toBeVisible();
    await expect(controls.getByRole('button', { name: 'Reset' })).toBeVisible();
    await expect(
      controls.getByRole('button', { name: 'Settings' }),
    ).toBeVisible();
  });
});
