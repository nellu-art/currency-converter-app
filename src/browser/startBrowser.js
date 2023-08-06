import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export async function startBrowser() {
  try {
    const browser = IS_PRODUCTION ? await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
    }) : await puppeteer.launch({
      headless: true,
    });
    return browser;
  } catch (err) {
    throw new Error('Could not create a browser instance => : ', err);
  }
}
