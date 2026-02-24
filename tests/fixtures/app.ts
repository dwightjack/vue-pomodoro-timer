import { test as base, expect, Page, Locator } from '@playwright/test';
import { Interval, IntervalType } from '../../src/types';
import { uid } from 'uid';

export const mockInterval = (
  type: IntervalType,
  duration: number,
): Interval => ({
  type,
  duration: duration * 60 * 1000,
  id: uid(),
});

export class AppPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  get timer(): Locator {
    return this.page.getByRole('timer');
  }

  get intervalList(): Locator {
    return this.page.getByRole('group', { name: 'Intervals' });
  }

  get settingsDialog(): Locator {
    return this.page.getByRole('dialog', { name: 'Settings' });
  }

  // Actions
  async gotoRoot() {
    await this.page.goto('/');
  }

  async setCycle(cycle: Interval[]) {
    await this.page.addInitScript((cycle) => {
      window.localStorage.setItem('intervals', JSON.stringify(cycle));
    }, cycle);
  }

  async openSettings() {
    await this.page.getByRole('button', { name: 'Settings' }).click();
  }

  async closeSettings() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }

  async saveSettings() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async play() {
    await this.page.getByRole('button', { name: 'Play' }).click();
  }

  async pause() {
    await this.page.getByRole('button', { name: 'Pause' }).click();
  }

  async skip() {
    await this.page.getByRole('button', { name: 'Skip' }).click();
  }

  async reset() {
    await this.page.getByRole('button', { name: 'Reset' }).click();
  }
}

interface TestFixtures {
  appPage: AppPage;
}

export const test = base.extend<TestFixtures>({
  appPage: async ({ page }, use) => {
    await use(new AppPage(page));
  },
});

export { expect };
