import express from 'express';

import * as currencyController from '../controllers/currency.controller.js';

const currencyRouter = express.Router();

currencyRouter.get('/rates', (req, res, next) => {
  const queryParams = req.query;

  if (!Object.keys(queryParams).length) {
    return next();
  }

  if (!queryParams.currencies) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Bad request',
      error: 'currencies query param is required'
    });
  }

  return next();
}, currencyController.getCurrenciesRates);

currencyRouter.get('/list', currencyController.getAllCurrencies);

export default currencyRouter;
