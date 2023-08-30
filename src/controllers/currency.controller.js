import { startBrowser } from '../browser/startBrowser.js';
import { Record } from '../db/record.model.js';
import { CURRENCIES, defaultBaseCurrency, currenciesWithCountry } from '../constants/currencies.js';
import { runPromisesInSequence, getCurrencyRate } from './utils.js'

const stackSize = 17

async function getCurrencyRatesFromGoogle(userCurrencies = CURRENCIES) {
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

async function getCurrencyRatesFromDb() {
  try {
    const records = await Record.find().sort({ createdAt: -1 }).limit(1);
    if (!records.length) {
      return { currencies: [], updatedAt: null, createdAt: null };
    }

    const { currencies, updatedAt, createdAt } = records[0];

    return { currencies, updatedAt, createdAt }
  } catch (err) {
    throw new Error(`Error getting currency rates from db: ${err}`);
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
  const { currencies: userCurrencies = '' } = req.query;

  const mappedUserCurrencies = userCurrencies.length ? userCurrencies.split(',').map((currency) => currency.trim().toUpperCase().replace(/[^A-Z]/g, '')) : undefined;

  try {
    const data = await getCurrencyRatesFromDb();

    if (!data.updatedAt || !data.createdAt || !data.currencies.length) {
      const googleData = await getCurrencyRatesFromGoogle(mappedUserCurrencies);
      data.currencies = googleData;
      data.updatedAt = new Date();
      data.createdAt = data.createdAt || new Date();
    } else if (mappedUserCurrencies?.length) {
      data.currencies = data.currencies.filter(({ name }) => mappedUserCurrencies.includes(name));
    }

    return res.json(data);
  } catch (err) {
    return next(err);
  }
}

export async function getAllCurrencies(req, res, next) {
  try {
    return res.json({ data: currenciesWithCountry });
  } catch (err) {
    return next(err);
  }
}