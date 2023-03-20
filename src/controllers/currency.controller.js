import { createPage } from './page.controller.js';
import { startBrowser } from './browser.controller.js';

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
    return { [`${currency}to${baseCurrency}`]: +lastPriceValue };
  } catch (error) {
    console.log('error', error);
  }
}

const baseCurrency = 'USD';

const currencies = ['USD', 'EUR', 'KZT', 'THB', 'IDR', 'TRY', 'AED', 'RUB', 'GEL', 'GBP'];

export async function getCurrenciesRates(req, res) {
  let browser;
  let currenciesRates;

  try {
    browser = await startBrowser();

    currenciesRates = await Promise.all(
      currencies
        .filter((currency) => currency !== baseCurrency)
        .map((currency) => getCurrencyRate({ browser, baseCurrency, currency }))
    );
  } catch (err) {
    console.error(err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  res.json(currenciesRates);
}
