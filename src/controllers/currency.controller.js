import { createPage } from '../browser/createPage.js';
import { startBrowser } from '../browser/startBrowser.js';
import { Record } from '../db/record.model.js';

const defaultBaseCurrency = 'USD';
const currencies = ['EUR', 'KZT', 'THB', 'IDR', 'TRY', 'AED', 'RUB', 'GEL', 'GBP'];
const ONE_HOUR = 1000 * 60 * 60;

async function getCurrencyRate({ browser, baseCurrency = 'USD', currency }) {
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

    await page.waitForSelector(`div[data-target="${currency}"]`);
    const lastPriceValue = await (
      await page.$(`div[data-target="${currency}"]`)
    ).evaluate((node) => node.getAttribute('data-last-price'));

    await page.close();
    return { name: currency, value: lastPriceValue };
  } catch (error) {
    throw new Error(`Error getting currency rate for ${currency}: ${error}`);
  }
}

async function getCurrencyRatesFromGoogle(req, res, next) {
  let browser;
  let currenciesRates;

  try {
    browser = await startBrowser();

    currenciesRates = await Promise.all(
      currencies.map((currency) => getCurrencyRate({ browser, baseCurrency: defaultBaseCurrency, currency }))
    );
  } catch (err) {
    return next(err);
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
      return { currencies: [], updatedAt: null };
    }

    const { currencies, updatedAt, createdAt } = records[0];

    return { currencies, updatedAt, createdAt }
  } catch (err) {
    return next(err);
  }
}

export async function getCurrenciesRates(req, res, next) {
  const data = await getCurrencyRatesFromDb(req, res, next);

  if (!data.updatedAt || new Date() - data.updatedAt > ONE_HOUR) {
    const googleData = await getCurrencyRatesFromGoogle(req, res, next);
    data.currencies = googleData;
    data.updatedAt = new Date();
    try {
      await Record.findOneAndUpdate({
        createdAt: data.createdAt,
      }, { currencies: googleData, updatedAt: data.updatedAt }, { upsert: true });
    } catch (err) {
      return next(err);
    }
  }

  return res.json(data);
}