import { test, expect } from '@playwright/test';
import { uid } from 'uid';
import { IntervalType } from '../src/types';

const mockInterval = (type: IntervalType, duration: number) => ({
  type,
  duration: duration * 60 * 1000,
  id: uid(),
});

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

test.describe('functionality', () => {
  test.beforeEach(async ({ page }) => {
    // set two intervals
    await page.addInitScript(
      (intervals) => {
        window.localStorage.setItem('intervals', JSON.stringify(intervals));
      },
      [
        mockInterval(IntervalType.Work, 1),
        mockInterval(IntervalType.ShortBreak, 2),
      ],
    );
    await page.goto('/');
  });
  test('list of two intervals', async ({ page }) => {
    const list = page.getByRole('list', { name: 'Intervals' });
    await expect(list.getByRole('listitem')).toHaveCount(2);
  });

  test('play', async ({ page }) => {
    await page.getByRole('button', { name: 'Play' }).click();

    await expect(page.getByRole('button', { name: 'Play' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
  });

  test('pause', async ({ page }) => {
    await page.getByRole('button', { name: 'Play' }).click();

    await expect(page.getByRole('button', { name: 'Play' })).not.toBeVisible();
    await page.getByRole('button', { name: 'Pause' }).click();
    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  });

  test('skip', async ({ page }) => {
    await expect(page.getByRole('timer')).toContainText('01:00');
    await page.getByRole('button', { name: 'Skip' }).click();
    await page.waitForTimeout(700);

    await expect(page.getByRole('timer')).toContainText('02:00');
  });
});
