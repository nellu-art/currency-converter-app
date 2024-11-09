import puppeteer from 'puppeteer-core';
import { IS_PRODUCTION } from '../constants/isProduction.js';

export async function startBrowser() {
    try {
        if (IS_PRODUCTION) {
            // Production connection with launch arguments for stability
            const launchArgs = JSON.stringify({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                // Using new headless mode
                headless: 'new',
                // Adding timeout for connection stability
                timeout: 30000,
            });

            const browser = await puppeteer.connect({
                browserWSEndpoint: `wss://chrome.browserless.io/?token=${process.env.BROWSERLESS_TOKEN}&proxy=residential&launch=${launchArgs}`,
            });
            return browser;
        } else {
            // Local development launch
            return await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
        }
    } catch (err) {
        console.error('Browser launch error:', err);
        throw new Error(`Could not create a browser instance: ${err.message}`);
    }
}
