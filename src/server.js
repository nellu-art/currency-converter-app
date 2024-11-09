import { IS_PRODUCTION } from './constants/isProduction.js';
import { updateCurrenciesRates } from './controllers/updateCurrenciesRates.js';

const importDotenv = async () => {
    if (!IS_PRODUCTION) {
        const dotenv = await import('dotenv');
        dotenv.config();
        console.log('Environment variables loaded successfully!');
    }
};

const main = async () => {
    try {
        await importDotenv();
        console.log('Starting updating currencies rates...');
        await updateCurrenciesRates();
        console.log('Currencies rates updated successfully!');
    } catch (error) {
        console.error(`Error updating currencies rates: ${error instanceof Error ? error.message : error}`);
    }
};

main();
