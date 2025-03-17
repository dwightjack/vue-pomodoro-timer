/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type Page,
  type Locator,
  test as base,
  expect as baseExpect,
} from '@playwright/test';
import { Interval } from '../../src/types';
import { uid } from 'uid';
import { IntervalType } from '../../src/types';

export const mockInterval = (type: IntervalType, duration: number) => ({
  type,
  duration: duration * 60 * 1000,
  id: uid(),
});

class Queries {
  protected readonly list: Locator;
  protected readonly controls: Locator;

  readonly timer: Locator;

  constructor(public readonly page: Page) {
    this.list = this.page.getByRole('list', { name: 'Intervals' });
    this.timer = this.page.getByRole('timer');
    this.controls = this.page.getByRole('group', { name: 'Timer controls' });
  }

  getControl(name: string | RegExp, { context }: { context?: Locator } = {}) {
    return (context ?? this.controls).getByRole('button', { name });
  }

  getButton(name: string | RegExp, { context }: { context?: Locator } = {}) {
    return (context ?? this.page).getByRole('button', { name });
  }

  getIntervalList() {
    return this.list.getByRole('listitem');
  }

  getIntervalByType(type: 'W' | 'LB' | 'SB') {
    return this.getIntervalList().filter({ hasText: type });
  }

  getIntervalByDuration(duration: number) {
    return this.getIntervalList().filter({
      hasText: `${String(duration).padStart(2, '0')}:00`,
    });
  }
}

export class AppPage {
  constructor(public readonly page: Page) {}

  async setStorage(intervals: Interval[]) {
    // set two intervals
    await this.page.addInitScript((intervals) => {
      window.localStorage.setItem('intervals', JSON.stringify(intervals));
    }, intervals);
  }

  async withinSettings(fn: (dialog: Locator) => Promise<void> | void) {
    await fn(this.page.getByRole('dialog', { name: 'Settings' }));
  }
}

export const test = base.extend<{ appPage: AppPage; queries: Queries }>({
  appPage: async ({ page }, use) => {
    const todoPage = new AppPage(page);

    await use(todoPage);
  },
  queries: async ({ page }, use) => {
    await use(new Queries(page));
  },
});

export const expect = baseExpect.extend({
  async toHaveOptions(
    locator: Locator,
    expectedOptions: string[],
    options?: { timeout?: number },
  ) {
    const assertionName = 'toHaveOptions';
    let pass = true;

    let matcherResult: any;
    try {
      const optionsLocator = locator.getByRole('option');
      await baseExpect(optionsLocator).toHaveText(expectedOptions, options);
    } catch (e) {
      matcherResult = (e as any).matcherResult;
      pass = false;
    }

    const message = () =>
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Locator: ${locator}\n` +
      `Expected options: ${this.utils.printExpected(expectedOptions)}\n` +
      `Received options: ${this.utils.printReceived(matcherResult?.actual)}`;

    return {
      message,
      pass,
      name: assertionName,
      expected: expectedOptions,
      actual: matcherResult?.actual,
    };
  },
  async toHaveSelected(
    locator: Locator,
    expected: string | RegExp,
    options?: { timeout?: number },
  ) {
    const assertionName = 'toHaveOptions';
    let pass = true;

    let matcherResult: any;
    try {
      const matchOptionValue =
        (await locator
          .getByRole('option', { name: expected })
          .getAttribute('value')) ?? expected;
      await baseExpect(locator).toHaveValue(matchOptionValue, options);
    } catch (e) {
      matcherResult = (e as any).matcherResult;
      pass = false;
    }

    const message = () =>
      this.utils.matcherHint(assertionName, undefined, undefined, {
        isNot: this.isNot,
      }) +
      '\n\n' +
      `Locator: ${locator}\n` +
      `Expected selected option: ${this.utils.printExpected(expected)}\n` +
      `Received selected option: ${this.utils.printReceived(matcherResult?.actual)}`;

    return {
      message,
      pass,
      name: assertionName,
      expected,
      actual: matcherResult?.actual,
    };
  },
});
