import schedule from 'node-schedule'
import { updateCurrenciesRates } from './currency.controller.js'

const rule = new schedule.RecurrenceRule();
// executes the function every hour at 00 minutes after the hour
rule.minute = 0;

export function setUpdateJob() {
  schedule.scheduleJob(rule, updateCurrenciesRates);
}