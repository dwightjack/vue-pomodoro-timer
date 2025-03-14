import { test, expect } from './fixtures/app';
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
  test('default timer', async ({ appPage }) => {
    await expect(appPage.timer).toContainText('45:00');
  });
  test('default timer - accessible name', async ({ appPage }) => {
    await expect(appPage.timer).toContainText('45 minutes left');
  });
  test('cycle list', async ({ appPage }) => {
    await expect(appPage.list.getByRole('listitem')).toHaveCount(1);
    await expect(appPage.list.getByRole('listitem')).toContainText('W');
    await expect(appPage.list.getByRole('listitem')).toContainText('45:00');
  });

  test('controls', async ({ appPage }) => {
    await expect(
      appPage.controls.getByRole('button', { name: 'Play' }),
    ).toBeVisible();
    await expect(
      appPage.controls.getByRole('button', { name: 'Skip' }),
    ).toBeVisible();
    await expect(
      appPage.controls.getByRole('button', { name: 'Reset' }),
    ).toBeVisible();
    await expect(
      appPage.controls.getByRole('button', { name: 'Settings' }),
    ).toBeVisible();
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

  test('list of two intervals', async ({ appPage }) => {
    await expect(appPage.list.getByRole('listitem')).toHaveCount(2);
  });

  test('play', async ({ appPage }) => {
    await appPage.controls.getByRole('button', { name: 'Play' }).click();

    await expect(
      appPage.controls.getByRole('button', { name: 'Play' }),
    ).not.toBeVisible();
    await expect(
      appPage.controls.getByRole('button', { name: 'Pause' }),
    ).toBeVisible();
  });

  test('pause', async ({ appPage }) => {
    await appPage.controls.getByRole('button', { name: 'Play' }).click();

    await expect(
      appPage.controls.getByRole('button', { name: 'Play' }),
    ).not.toBeVisible();
    await appPage.controls.getByRole('button', { name: 'Pause' }).click();
    await expect(
      appPage.controls.getByRole('button', { name: 'Play' }),
    ).toBeVisible();
  });

  test('skip', async ({ appPage }) => {
    await expect(appPage.timer).toContainText('01:00');

    await appPage.controls.getByRole('button', { name: 'Skip' }).click();
    await appPage.page.waitForTimeout(700);

    await expect(appPage.timer).toContainText('02:00');
  });

  test('skip cycle', async ({ appPage }) => {
    await expect(appPage.timer).toContainText('01:00');

    await appPage.controls.getByRole('button', { name: 'Skip' }).click();
    await appPage.page.waitForTimeout(700);

    await expect(appPage.timer).toContainText('02:00');

    await appPage.controls.getByRole('button', { name: 'Skip' }).click();
    await appPage.page.waitForTimeout(700);

    await expect(appPage.timer).toContainText('01:00');
  });

  test('skip when paused', async ({ appPage }) => {
    await appPage.controls.getByRole('button', { name: 'Skip' }).click();
    await appPage.page.waitForTimeout(700);

    await expect(appPage.timer).toContainText('02:00');
    await expect(
      appPage.controls.getByRole('button', { name: 'Play' }),
    ).toBeVisible();
  });

  test('skip when playing', async ({ appPage }) => {
    await appPage.controls.getByRole('button', { name: 'Play' }).click();
    await appPage.controls.getByRole('button', { name: 'Skip' }).click();
    await appPage.page.waitForTimeout(700);

    await expect(appPage.timer).toContainText('02:00');
    await expect(
      appPage.controls.getByRole('button', { name: 'Pause' }),
    ).toBeVisible();
  });
});
