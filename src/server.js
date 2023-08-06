import express from 'express';
import createError from 'http-errors';

import {connectToDb} from './db/connectToDb.js';
import currencyRouter from './routes/currency.router.js';

const app = express();
const port = 5000;

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/currencies', currencyRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    error: req.app.get('env') === 'development' ? {...err, stack: err.stack} : {}
})
});

app.listen(port);
