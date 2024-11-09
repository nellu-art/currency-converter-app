import { getCurrencyRatesFromGoogle } from './utils.js';
import { getRecords, updateRecords } from '../db/index.js';

export async function updateCurrenciesRates() {
    try {
        const googleData = await getCurrencyRatesFromGoogle();
        const data = getRecords();

        const { createdAt, currencies } = data.records[0] ?? {};

        updateRecords({
            currencies: googleData.map(({ name, value }) => ({
                name,
                value: !value ? currencies.find((c) => c.name === name)?.value : value,
            })),
            updatedAt: new Date(),
            createdAt: createdAt || new Date(),
        });
    } catch (err) {
        console.error(`Error updating currencies rates: ${err}`);
    }
}
