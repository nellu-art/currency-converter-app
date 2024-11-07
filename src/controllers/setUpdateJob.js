import schedule from 'node-schedule'
import { IS_PRODUCTION } from '../constants/isProduction.js';

import { getCurrencyRatesFromGoogle } from './utils.js';
import { getRecords, updateRecords } from '../db/index.js';

const rule = new schedule.RecurrenceRule();
// executes the function every hour at 00 minutes after the hour
rule.minute = 0;
// executes the function from Monday to Friday
rule.dayOfWeek = [new schedule.Range(1, 5)];

async function updateCurrenciesRates() {
  try {
    const googleData = await getCurrencyRatesFromGoogle();
    const data = getRecords

    const { createdAt } = data.records[0] ?? {}

    updateRecords({ currencies: googleData, updatedAt: new Date(), createdAt: createdAt || new Date() });
  } catch (err) {
    console.error(`Error updating currencies rates: ${err}`);
  }
}

export function setUpdateJob() {
  if (!IS_PRODUCTION) {
    return;
  }

  schedule.scheduleJob(rule, updateCurrenciesRates);
}