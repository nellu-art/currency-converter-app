import express from 'express';

import * as currencyController from '../controllers/currency.controller.js';

const currencyRouter = express.Router();

currencyRouter.get('/', currencyController.getCurrenciesRates);

export default currencyRouter;
