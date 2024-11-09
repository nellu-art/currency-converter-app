import { updateCurrenciesRates } from './controllers/updateCurrenciesRates.js';

const main = async () => {
    console.log('Starting updating currencies rates...');
    await updateCurrenciesRates();
    console.log('Currencies rates updated successfully!');
};

main();
