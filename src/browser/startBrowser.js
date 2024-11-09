import puppeteer from 'puppeteer-core';
import { IS_PRODUCTION } from '../constants/isProduction.js';

export async function startBrowser() {
    try {
        const browser = IS_PRODUCTION
            ? await puppeteer.connect({
                  browserWSEndpoint: `wss://production-sfo.browserless.io/?token=${process.env.BROWSERLESS_TOKEN}&proxy=residential`,
              })
            : await puppeteer.launch({
                  // headless: IS_PRODUCTION ? 'new' : false,
                  headless: true,
              });
        return browser;
    } catch (err) {
        throw new Error('Could not create a browser instance => : ', JSON.stringify(err));
    }
}
