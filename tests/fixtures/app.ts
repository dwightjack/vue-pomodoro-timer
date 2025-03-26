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

interface QueriesOptions {
  root?: boolean;
}

class BaseQueries {
  #ctxList: Locator[] = [];
  #root: Page;
  constructor(public readonly page: Page) {
    this.#root = page;
  }

  get parent() {
    return this.#ctxList.at(-1);
  }

  get root() {
    return this.#root;
  }

  #getCurrent(fromRoot = false) {
    return fromRoot ? this.#root : this.#ctxList.at(-1) || this.#root;
  }

  getButton(name: string | RegExp, { root = false }: QueriesOptions = {}) {
    return this.#getCurrent(root).getByRole('button', { name });
  }

  async within<L extends Locator>(
    base: L,
    fn: (base: L) => Promise<void> | void,
  ) {
    this.#ctxList.push(base);
    await fn(base);
    this.#ctxList.pop();
  }

  static defineWithin<Q extends BaseQueries, L extends Locator>(
    srcQuery: Q,
    base: L,
  ) {
    return (fn: (base: L) => Promise<void> | void) => srcQuery.within(base, fn);
  }
}

class Queries extends BaseQueries {
  readonly list: Locator;

  readonly timer: Locator;

  withinControls: ReturnType<typeof BaseQueries.defineWithin>;
  withinSettings: ReturnType<typeof BaseQueries.defineWithin>;

  constructor(page: Page) {
    super(page);
    this.list = page.getByRole('list', { name: 'Intervals' });
    this.timer = page.getByRole('timer');

    this.withinControls = BaseQueries.defineWithin(
      this,
      page.getByRole('group', { name: 'Timer controls' }),
    );

    this.withinSettings = BaseQueries.defineWithin(
      this,
      page.getByRole('dialog', { name: 'Settings' }),
    );
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
