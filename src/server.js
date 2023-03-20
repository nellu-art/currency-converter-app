import express from 'express';

import currencyRouter from './routes/currency.router.js';

const app = express();
const port = 3000;

app.use((req, res, next) => {
  const start = Date.now();
  next();
  const delta = Date.now() - start;
  console.log(`${req.method} ${req.baseUrl}${req.url} ${delta}ms`);
});

app.use(express.json());

app.use('/currencies', currencyRouter);

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
