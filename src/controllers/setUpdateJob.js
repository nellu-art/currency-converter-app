import schedule from 'node-schedule'
import { updateCurrenciesRates } from './currency.controller.js'

const rule = new schedule.RecurrenceRule();
// executes the function every hour at 00 minutes after the hour
rule.minute = 0;
// executes the function from Monday to Friday
rule.dayOfWeek = [new schedule.Range(1, 5)];

export function setUpdateJob() {
  schedule.scheduleJob(rule, updateCurrenciesRates);
}