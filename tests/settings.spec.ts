import { test, expect, mockInterval } from './fixtures/app';
import { IntervalType } from '../src/types';

test.describe('dialog interactions', () => {
  test.beforeEach(async ({ appPage }) => {
    await appPage.gotoRoot();
  });

  test('open settings dialog', async ({ appPage }) => {
    await appPage.openSettings();
    await expect(appPage.settingsDialog).toBeVisible();
  });

  test('close settings dialog with button', async ({ appPage, page }) => {
    await appPage.openSettings();
    await expect(appPage.settingsDialog).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(appPage.settingsDialog).not.toBeVisible();
  });

  test('close settings dialog with key', async ({ appPage, page }) => {
    await appPage.openSettings();

    await expect(appPage.settingsDialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(appPage.settingsDialog).not.toBeVisible();
  });
});

test.describe('functionality', () => {
  test.beforeEach(async ({ appPage }) => {
    await appPage.gotoRoot();
    await appPage.openSettings();
  });
  test('Type field', async ({ appPage }) => {
    const select = appPage.settingsDialog.getByLabel('Type');
    await expect(select).toHaveValue('work');
  });
  test('Duration field', async ({ appPage }) => {
    const duration = appPage.settingsDialog.getByLabel(/Duration/);
    await expect(duration).toHaveAttribute('type', 'number');
    await expect(duration).toHaveValue('45');
  });
  test('Update an interval', async ({ appPage }) => {
    await appPage.settingsDialog.getByLabel(/Duration/).fill('1');
    await appPage.settingsDialog
      .getByLabel('Type')
      .selectOption({ label: 'Short Break' });

    await appPage.saveSettings();

    const newTimer = appPage.intervalList.getByRole('meter').first();
    await expect(newTimer).toHaveAccessibleName('Short Break');
    await expect(newTimer).toHaveAttribute('aria-valuetext', '1 minute');
  });
  test('Add an interval', async ({ appPage, page }) => {
    await page.getByRole('button', { name: 'Add' }).click();

    const row = appPage.settingsDialog.getByRole('group').last();

    await row.getByLabel('Type').selectOption({ label: 'Short Break' });
    await row.getByLabel(/Duration/).fill('20');
    await appPage.saveSettings();

    const newTimer = appPage.intervalList.getByRole('meter').last();
    await expect(newTimer).toHaveAttribute('aria-valuetext', '20 minutes');
    await expect(newTimer).toHaveAccessibleName('Short Break');
  });

  test('Remove an interval', async ({ appPage }) => {
    await appPage.setCycle([
      mockInterval(IntervalType.Work, 1),
      mockInterval(IntervalType.ShortBreak, 2),
    ]);
    await appPage.gotoRoot();
    await expect(appPage.intervalList.getByRole('meter')).toHaveCount(2);

    await appPage.openSettings();

    const row = appPage.settingsDialog.getByRole('group').first();

    await row.getByRole('button', { name: 'Delete' }).click();

    await appPage.saveSettings();

    await expect(appPage.intervalList.getByRole('meter')).toHaveCount(1);
  });

  test('save settings resets timer', async ({ appPage, page }) => {
    await appPage.closeSettings();
    await appPage.play();
    await page.waitForTimeout(1000);
    await appPage.openSettings();
    await appPage.saveSettings();

    await expect(appPage.timer).toContainText('45:00');
  });
});
