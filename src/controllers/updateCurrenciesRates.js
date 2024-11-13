import { getCurrencyRatesFromGoogle } from './utils.js';
import { getRecords, updateRecords } from '../db/index.js';
import { CURRENCIES, defaultBaseCurrency } from '../constants/currencies.js';

export async function updateCurrenciesRates() {
    try {
        const googleData = await getCurrencyRatesFromGoogle();
        const data = getRecords();

        const { createdAt, currencies } = data.records[0] ?? {};

        const googleCurrencyDataMap = new Map(googleData.map(({ name, value }) => [name, value]));

        updateRecords({
            currencies: [{ name: defaultBaseCurrency, value: '1' }].concat(
                CURRENCIES.map((name) => ({
                    name,
                    value: googleCurrencyDataMap.get(name) ?? currencies.find((c) => c.name === name)?.value,
                })),
            ),
            updatedAt: new Date(),
            createdAt: createdAt || new Date(),
        });
    } catch (err) {
        console.error(`Error updating currencies rates: ${err}`);
    }
}
