import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function startBrowser() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    return browser;
  } catch (err) {
    throw new Error('Could not create a browser instance => : ', err);
  }
}
