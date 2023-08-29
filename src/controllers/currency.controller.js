import { createPage } from '../browser/createPage.js';
import { startBrowser } from '../browser/startBrowser.js';
import { Record } from '../db/record.model.js';
import { currencies, defaultBaseCurrency } from '../constants/currencies.js';


async function getCurrencyRate({ browser, baseCurrency = defaultBaseCurrency, currency }) {
  if (!currency) {
    throw new Error('currency parameter is missing');
  }
  if (!browser) {
    throw new Error('browser is missing');
  }

  const url = `https://www.google.com/finance/quote/${baseCurrency}-${currency}`;

  try {
    const page = await createPage(browser);
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    const lastPriceValue = await (
      await page.$(`div[data-target="${currency}"]`)
    ).evaluate((node) => node.getAttribute('data-last-price'));

    await page.close();
    return { name: currency, value: lastPriceValue };
  } catch (error) {
    throw new Error(`Error getting currency rate for ${currency}: ${error}`);
  }
}

async function getCurrencyRatesFromGoogle(next) {
  let browser;
  let currenciesRates;

  try {
    browser = await startBrowser();

    const results = await Promise.allSettled(
      currencies.map((currency) => getCurrencyRate({ browser, baseCurrency: defaultBaseCurrency, currency }))
    );
    currenciesRates = results.reduce((res, current) => current.status === 'fulfilled' ? [...res, current.value] : res, []);
  } catch (err) {
    if (next) {
      return next(err);
    }
    throw new Error(`Error getting currency rates: ${err}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return [{ name: defaultBaseCurrency, value: '1' }].concat(currenciesRates);
}

async function getCurrencyRatesFromDb(req, res, next) {
  try {
    const records = await Record.find().sort({ createdAt: -1 }).limit(1);
    if (!records.length) {
      return { currencies: [], updatedAt: null, createdAt: null };
    }

    const { currencies, updatedAt, createdAt } = records[0];

    return { currencies, updatedAt, createdAt }
  } catch (err) {
    return next(err);
  }
}

export async function updateCurrenciesRates() {
  try {
    const googleData = await getCurrencyRatesFromGoogle();
    const records = await Record.find().sort({ createdAt: -1 }).limit(1);

    const { createdAt } = records[0] ?? {}

    await Record.findOneAndUpdate({
      createdAt: createdAt || new Date(),
    }, { currencies: googleData, updatedAt: new Date() }, { upsert: true });
  } catch (err) {
    console.error(`Error updating currencies rates: ${err}`);
  }
}

export async function getCurrenciesRates(req, res, next) {
  try {
    const data = await getCurrencyRatesFromDb(req, res, next);

    if (!data.updatedAt || !data.createdAt || !data.currencies.length) {
      const googleData = await getCurrencyRatesFromGoogle(next);
      data.currencies = googleData;
      data.updatedAt = new Date();
      data.createdAt = data.createdAt || new Date();
    }

    return res.json(data);
  } catch (err) {
    return next(err);
  }
}