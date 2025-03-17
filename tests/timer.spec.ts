import { test, expect, mockInterval } from './fixtures/app';
import { IntervalType } from '../src/types';

test.describe('initial state', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  test('default timer', async ({ queries }) => {
    await expect(queries.timer).toContainText('45:00');
  });
  test('default timer - accessible name', async ({ queries }) => {
    await expect(queries.timer).toContainText('45 minutes left');
  });
  test('cycle list', async ({ queries }) => {
    const list = queries.getIntervalList();
    await expect(list).toHaveCount(1);
    await expect(list.first()).toContainText('W');
    await expect(list.first()).toContainText('45:00');
  });

  test('controls', async ({ queries }) => {
    await expect(queries.getControl('Play')).toBeVisible();
    await expect(queries.getControl('Skip')).toBeVisible();
    await expect(queries.getControl('Reset')).toBeVisible();
    await expect(queries.getControl('Settings')).toBeVisible();
  });
});

test.describe('functionality', () => {
  test.beforeEach(async ({ page, appPage }) => {
    await appPage.setStorage([
      mockInterval(IntervalType.Work, 1),
      mockInterval(IntervalType.ShortBreak, 2),
    ]);
    await page.goto('/');
  });

  test('list of two intervals', async ({ queries }) => {
    await expect(queries.getIntervalList()).toHaveCount(2);
  });

  test('play', async ({ queries }) => {
    await queries.getControl('Play').click();

    await expect(queries.getControl('Play')).not.toBeVisible();
    await expect(queries.getControl('Pause')).toBeVisible();
  });

  test('pause', async ({ queries }) => {
    await queries.getControl('Play').click();

    await expect(queries.getControl('Play')).not.toBeVisible();
    await queries.getControl('Pause').click();
    await expect(queries.getControl('Play')).toBeVisible();
  });

  test('skip', async ({ queries, page }) => {
    await expect(queries.timer).toContainText('01:00');

    await queries.getControl('Skip').click();
    await page.waitForTimeout(700);

    await expect(queries.timer).toContainText('02:00');
  });

  test('skip cycle', async ({ queries, page }) => {
    await expect(queries.timer).toContainText('01:00');

    await queries.getControl('Skip').click();
    await page.waitForTimeout(700);

    await expect(queries.timer).toContainText('02:00');

    await queries.getControl('Skip').click();
    await page.waitForTimeout(700);

    await expect(queries.timer).toContainText('01:00');
  });

  test('skip when paused', async ({ queries, page }) => {
    await queries.getControl('Skip').click();
    await page.waitForTimeout(700);

    await expect(queries.timer).toContainText('02:00');
    await expect(queries.getControl('Play')).toBeVisible();
  });

  test('skip when playing', async ({ queries, page }) => {
    await queries.getControl('Play').click();
    await queries.getControl('Skip').click();
    await page.waitForTimeout(700);

    await expect(queries.timer).toContainText('02:00');
    await expect(queries.getControl('Pause')).toBeVisible();
  });
});
