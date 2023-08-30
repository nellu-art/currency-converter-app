import express from 'express';

import * as currencyController from '../controllers/currency.controller.js';

const currencyRouter = express.Router();

currencyRouter.get('/', currencyController.getCurrenciesRates);

currencyRouter.get('/list', currencyController.getAllCurrencies);

export default currencyRouter;
