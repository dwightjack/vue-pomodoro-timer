import { test, expect, mockInterval } from './fixtures/app';
import { IntervalType } from '../src/types';

test.describe('initial state', () => {
  test.beforeEach(async ({ appPage }) => {
    await appPage.gotoRoot();
  });
  test('default timer', async ({ appPage }) => {
    await expect(appPage.timer).toContainText('45:00');
  });

  test('cycle list', async ({ appPage }) => {
    await expect(appPage.intervalList.getByRole('meter')).toHaveCount(1);
    await expect(
      appPage.intervalList.getByRole('meter').first(),
    ).toHaveAccessibleName('Work');
    await expect(
      appPage.intervalList.getByRole('meter').first(),
    ).toHaveAttribute('aria-valuetext', '45 minutes');
  });

  test('controls', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Play' })).toBeInViewport();
    await expect(page.getByRole('button', { name: 'Skip' })).toBeInViewport();
    await expect(page.getByRole('button', { name: 'Reset' })).toBeInViewport();
    await expect(
      page.getByRole('button', { name: 'Settings' }),
    ).toBeInViewport();
  });
});

test.describe('functionality', () => {
  test.beforeEach(async ({ appPage }) => {
    await appPage.setCycle([
      mockInterval(IntervalType.Work, 1),
      mockInterval(IntervalType.ShortBreak, 2),
    ]);
    await appPage.gotoRoot();
  });

  test('list of two intervals', async ({ appPage }) => {
    await expect(appPage.intervalList.getByRole('meter')).toHaveCount(2);
  });

  test('play', async ({ appPage, page }) => {
    await appPage.play();

    await expect(
      page.getByRole('button', { name: 'Play' }),
    ).not.toBeInViewport();
    await expect(page.getByRole('button', { name: 'Pause' })).toBeInViewport();
  });

  test('pause', async ({ appPage, page }) => {
    await appPage.play();

    await expect(
      page.getByRole('button', { name: 'Play' }),
    ).not.toBeInViewport();
    await appPage.pause();

    await expect(
      page.getByRole('button', { name: 'Pause' }),
    ).not.toBeInViewport();
    await expect(page.getByRole('button', { name: 'Play' })).toBeInViewport();
  });

  test('skip', async ({ appPage, page }) => {
    await appPage.skip();
    await page.waitForTimeout(1000);

    await expect(appPage.timer).toContainText('02:00');
  });

  test('skip to end', async ({ appPage, page }) => {
    await appPage.skip();
    await appPage.skip();
    await page.waitForTimeout(1000);

    await expect(appPage.timer).toContainText('01:00');
  });

  test('reset', async ({ appPage, page }) => {
    await appPage.play();
    await page.waitForTimeout(1000);
    await appPage.reset();

    await expect(appPage.timer).toContainText('01:00');
  });
});
