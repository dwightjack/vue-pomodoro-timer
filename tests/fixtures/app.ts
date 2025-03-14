import { type Page, type Locator, test as base } from '@playwright/test';
import { Interval } from '../../src/types';
export class AppPage {
  readonly list: Locator;
  readonly timer: Locator;
  readonly controls: Locator;

  constructor(public readonly page: Page) {
    this.list = this.page.getByRole('list', { name: 'Intervals' });
    this.timer = this.page.getByRole('timer');
    this.controls = this.page.getByRole('group', { name: 'Timer controls' });
  }

  async setStorage(intervals: Interval[]) {
    // set two intervals
    await this.page.addInitScript((intervals) => {
      window.localStorage.setItem('intervals', JSON.stringify(intervals));
    }, intervals);
  }
}

export const test = base.extend<{ appPage: AppPage }>({
  appPage: async ({ page }, use) => {
    const todoPage = new AppPage(page);

    await use(todoPage);
  },
});

export { expect } from '@playwright/test';
