import express from 'express';

import { updateCurrenciesRates } from './controllers/updateCurrenciesRates.js';

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);

    updateCurrenciesRates();
});
