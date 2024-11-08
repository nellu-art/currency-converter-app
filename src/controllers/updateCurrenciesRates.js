import { getCurrencyRatesFromGoogle } from './utils.js';
import { getRecords, updateRecords } from '../db/index.js';

export async function updateCurrenciesRates() {
    try {
        const googleData = await getCurrencyRatesFromGoogle();
        const data = getRecords();

        const { createdAt } = data.records[0] ?? {};

        console.log('Updating currencies rates...', googleData);

        updateRecords({
            currencies: googleData,
            updatedAt: new Date(),
            createdAt: createdAt || new Date(),
        });
    } catch (err) {
        console.error(`Error updating currencies rates: ${err}`);
    }
}
