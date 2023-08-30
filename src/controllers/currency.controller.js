import { startBrowser } from '../browser/startBrowser.js';
import { Record } from '../db/record.model.js';
import { currencies, defaultBaseCurrency } from '../constants/currencies.js';
import { runPromisesInSequence, getCurrencyRate } from './utils.js'

const stackSize = 17

async function getCurrencyRatesFromGoogle(next) {
  let browser;
  let currenciesRates;

  try {
    browser = await startBrowser();

    const results = await runPromisesInSequence(currencies, stackSize, (currency) => getCurrencyRate({ browser, baseCurrency: defaultBaseCurrency, currency }))

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