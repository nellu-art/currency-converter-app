import { IS_PRODUCTION } from './constants/isProduction.js';
import { updateCurrenciesRates } from './controllers/updateCurrenciesRates.js';

if (!IS_PRODUCTION) {
    require('dotenv').config();
}

const main = async () => {
    console.log('Starting updating currencies rates...');
    await updateCurrenciesRates();
    console.log('Currencies rates updated successfully!');
};

main();
