import { createPage } from '../browser/createPage.js';
import { startBrowser } from '../browser/startBrowser.js';
import { CURRENCIES, defaultBaseCurrency } from '../constants/currencies.js';

const stackSize = 17

async function runPromisesInSequence(data, parallelCount, createPromise) {
  const result = [];
  for (let i = 0; i < data.length; i += parallelCount) {
    const chunk = data.slice(i, i + parallelCount);
    result.push(...(await Promise.allSettled(chunk.map(createPromise))));
  }
  return result;
}

async function getCurrencyRate({ browser, baseCurrency, currency }) {
  if (!currency) {
    throw new Error('currency parameter is missing');
  }
  if (!browser) {
    throw new Error('browser is missing');
  }
  if (!baseCurrency) {
    throw new Error('baseCurrency is missing');
  }

  const url = `https://www.google.com/finance/quote/${baseCurrency}-${currency}`;

  try {
    const page = await createPage(browser);
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    const target = await page.waitForSelector(`div[data-target="${currency}"]`);
    const lastPriceValue = await page.evaluate((node) => node.getAttribute('data-last-price'), target);

    await page.close();
    return { name: currency, value: lastPriceValue };
  } catch (error) {
    throw new Error(`Error getting currency rate for ${currency}: ${error}`);
  }
}

export async function getCurrencyRatesFromGoogle(userCurrencies = CURRENCIES) {
  let browser;
  let currenciesRates;

  try {
    browser = await startBrowser();

    const results = await runPromisesInSequence(userCurrencies, stackSize, (currency) => getCurrencyRate({ browser, baseCurrency: defaultBaseCurrency, currency }))

    currenciesRates = results.reduce((res, current) => current.status === 'fulfilled' ? [...res, current.value] : res, []);
  } catch (err) {
    throw new Error(`Error getting currency rates: ${err}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return [{ name: defaultBaseCurrency, value: '1' }].concat(currenciesRates);
}