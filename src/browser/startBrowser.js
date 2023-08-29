import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { IS_PRODUCTION } from '../constants/isProduction.js';

puppeteer.use(StealthPlugin());

export async function startBrowser() {
  try {
    const browser = IS_PRODUCTION ? await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
    }) : await puppeteer.launch({
      headless: IS_PRODUCTION ? 'new' : false,
    });
    return browser;
  } catch (err) {
    throw new Error('Could not create a browser instance => : ', err);
  }
}
