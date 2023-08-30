import { createPage } from '../browser/createPage.js';

export async function runPromisesInSequence(data, parallelCount, createPromise) {
  const result = [];
  for (let i = 0; i < data.length; i += parallelCount) {
    const chunk = data.slice(i, i + parallelCount);
    result.push(...(await Promise.allSettled(chunk.map(createPromise))));
  }
  return result;
}

export async function getCurrencyRate({ browser, baseCurrency, currency }) {
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