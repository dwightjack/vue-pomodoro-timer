import { IntervalType } from '../src/types';
import { test, expect, mockInterval } from './fixtures/app';

test.describe('dialog interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('open settings dialog', async ({ page, queries }) => {
    await queries.getButton('Settings').click();
    await expect(page.getByRole('dialog', { name: 'Settings' })).toBeVisible();
  });

  test('close settings dialog with button', async ({ queries, page }) => {
    await queries.getButton('Settings').click();
    await expect(page.getByRole('dialog', { name: 'Settings' })).toBeVisible();

    await queries.getButton('Cancel').click();
    await expect(
      page.getByRole('dialog', { name: 'Settings' }),
    ).not.toBeVisible();
  });

  test('close settings dialog with key', async ({ queries, page }) => {
    await queries.getButton('Settings').click();

    const dialog = page.getByRole('dialog', { name: 'Settings' });
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});

test.describe('functionality', () => {
  test.beforeEach(async ({ page, queries }) => {
    await page.goto('/');
    await queries.getButton('Settings').click();
  });
  test('Type field', async ({ queries }) => {
    await queries.withinSettings(async (settings) => {
      const select = settings.getByLabel('Type');
      await expect(select).toHaveRole('combobox');

      await expect(select).toHaveOptions(['Work', 'ShortBreak', 'LongBreak']);
      await expect(select).toHaveSelected('Work');
    });
  });
  test('Duration field', async ({ queries }) => {
    await queries.withinSettings(async (settings) => {
      const duration = settings.getByLabel(/Duration/);
      await expect(duration).toHaveAttribute('type', 'number');
      await expect(duration).toHaveValue('45');
    });
  });
  test('Update an interval', async ({ queries }) => {
    await queries.withinSettings(async (settings) => {
      await settings.getByLabel(/Duration/).fill('1');
      await settings.getByLabel('Type').selectOption({ label: 'ShortBreak' });

      await queries.getButton('Save').click();
    });

    const newTimer = queries.getIntervalList().first();
    await expect(newTimer).toContainText('SB');
    await expect(newTimer).toContainText('01:00');
  });
  test('Add an interval', async ({ queries }) => {
    await queries.withinSettings(async (settings) => {
      await queries.getButton('Add').click();

      const row = settings
        .getByRole('group', { name: 'Interval Settings' })
        .last();

      await row.getByLabel('Type').selectOption({ label: 'ShortBreak' });
      await row.getByLabel(/Duration/).fill('20');
      await queries.getButton('Save').click();
    });

    const newTimer = queries.getIntervalList().last();
    await expect(newTimer).toContainText('SB');
    await expect(newTimer).toContainText('20:00');
  });

  test('Remove an interval', async ({ appPage, queries, page }) => {
    await appPage.setStorage([
      mockInterval(IntervalType.Work, 1),
      mockInterval(IntervalType.ShortBreak, 2),
    ]);
    await page.reload();
    await expect(queries.getIntervalList()).toHaveCount(2);

    await queries.getButton('Settings').click();

    await queries.withinSettings(async (settings) => {
      const row = settings
        .getByRole('group', { name: 'Interval Settings' })
        .first();

      await queries.within(row, async () => {
        await queries.getButton('Delete').click();
      });

      await queries.getButton('Save').click();
    });

    await expect(queries.getIntervalList()).toHaveCount(1);
  });

  test('Cannot remove the interval when it is the only one', async ({
    queries,
  }) => {
    await queries.withinSettings(async (settings) => {
      const row = settings
        .getByRole('group', { name: 'Interval Settings' })
        .first();

      await queries.within(row, async () => {
        await expect(queries.getButton('Delete')).toBeDisabled();
      });
    });
  });
});

test.describe('interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  test('Saving the intervals reset the timer', async ({ queries, page }) => {
    await queries.getButton('Play').click();
    await page.waitForTimeout(2000);
    await queries.getButton('Settings').click();
    await queries.withinSettings(async () => {
      await queries.getButton('Save').click();
    });

    await expect(queries.getButton('Play')).toBeVisible();
  });
});
