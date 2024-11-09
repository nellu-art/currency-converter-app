import { createPage } from '../browser/createPage.js';
import { startBrowser } from '../browser/startBrowser.js';
import { CURRENCIES, defaultBaseCurrency } from '../constants/currencies.js';

const stackSize = 17;

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
    let page;

    try {
        page = await createPage(browser);
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
        });

        try {
            // Wait for the cookies dialog to appear and click the "Accept all" button
            await page.waitForSelector('button[aria-label="Accept all"]', {
                timeout: 1000,
            });
            await page.click('button[aria-label="Accept all"]');
        } catch (error) {
            // console.log('Cookies dialog not found or already accepted.');
        }

        let lastPriceValue;
        try {
            const target = await page.waitForSelector(`div[data-target="${currency}"]`, { timeout: 10000 });
            lastPriceValue = await page.evaluate((node) => node.getAttribute('data-last-price'), target);

            console.log(`Got currency rate for ${currency}: ${lastPriceValue}`);
        } catch (error) {
            console.log(`Error getting currency rate for ${currency}: ${error}`);
        }

        return { name: currency, value: lastPriceValue };
    } catch (error) {
        throw new Error(`Error getting currency rate for ${currency}: ${error}`);
    } finally {
        if (page) {
            await page.close();
        }
    }
}

export async function getCurrencyRatesFromGoogle(userCurrencies = CURRENCIES) {
    let browser;
    let currenciesRates;

    try {
        browser = await startBrowser();

        const results = await runPromisesInSequence(userCurrencies, stackSize, (currency) =>
            getCurrencyRate({
                browser,
                baseCurrency: defaultBaseCurrency,
                currency,
            }),
        );

        currenciesRates = results.reduce(
            (res, current) => (current.status === 'fulfilled' ? [...res, current.value] : res),
            [],
        );
    } catch (err) {
        throw new Error(`Error getting currency rates: ${err}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    return [{ name: defaultBaseCurrency, value: '1' }].concat(currenciesRates);
}
