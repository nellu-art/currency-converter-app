import schedule from 'node-schedule'
import { Record } from '../db/record.model.js';
import { IS_PRODUCTION } from '../constants/isProduction.js';

import { getCurrencyRatesFromGoogle } from './utils.js';

const rule = new schedule.RecurrenceRule();
// executes the function every hour at 00 minutes after the hour
rule.minute = 0;
// executes the function from Monday to Friday
rule.dayOfWeek = [new schedule.Range(1, 5)];

async function updateCurrenciesRates() {
  try {
    const googleData = await getCurrencyRatesFromGoogle();
    const records = await Record.find().sort({ createdAt: -1 }).limit(1);

    const { createdAt } = records[0] ?? {}

    await Record.findOneAndUpdate({
      createdAt: createdAt || new Date(),
    }, { currencies: googleData, updatedAt: new Date() }, { upsert: true });
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