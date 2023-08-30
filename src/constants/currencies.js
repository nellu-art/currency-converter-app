export const defaultBaseCurrency = 'USD';

const AsiaCurrencies = [
  {
    "currency": "AFN",
    "country": "Afghanistan"
  },
  {
    "currency": "AMD",
    "country": "Artsakh"
  },
  {
    "currency": "AZN",
    "country": "Azerbaijan"
  },
  {
    "currency": "BHD",
    "country": "Bahrain"
  },
  {
    "currency": "BDT",
    "country": "Bangladesh"
  },
  {
    "currency": "BTN",
    "country": "Bhutan"
  },
  {
    "currency": "BND",
    "country": "Brunei"
  },
  {
    "currency": "KHR",
    "country": "Cambodia"
  },
  {
    "currency": "CNY",
    "country": "China"
  },
  {
    "currency": "AUD",
    "country": "Australia"
  },
  {
    "currency": "GEL",
    "country": "Georgia"
  },
  {
    "currency": "HKD",
    "country": "Hong Kong"
  },
  {
    "currency": "INR",
    "country": "India"
  },
  {
    "currency": "IDR",
    "country": "Indonesia"
  },
  {
    "currency": "IRR",
    "country": "Iran"
  },
  {
    "currency": "IQD",
    "country": "Iraq"
  },
  {
    "currency": "ILS",
    "country": "Palestine"
  },
  {
    "currency": "JPY",
    "country": "Japan"
  },
  {
    "currency": "JOD",
    "country": "Jordan"
  },
  {
    "currency": "KZT",
    "country": "Kazakhstan"
  },
  {
    "currency": "KWD",
    "country": "Kuwait"
  },
  {
    "currency": "KGS",
    "country": "Kyrgyzstan"
  },
  {
    "currency": "LAK",
    "country": "Laos"
  },
  {
    "currency": "LBP",
    "country": "Lebanon"
  },
  {
    "currency": "MOP",
    "country": "Macau"
  },
  {
    "currency": "MYR",
    "country": "Malaysia"
  },
  {
    "currency": "MVR",
    "country": "Maldives"
  },
  {
    "currency": "MMK",
    "country": "Myanmar"
  },
  {
    "currency": "NPR",
    "country": "Nepal"
  },
  {
    "currency": "TRY",
    "country": "Turkey"
  },
  {
    "currency": "OMR",
    "country": "Oman"
  },
  {
    "currency": "PKR",
    "country": "Pakistan"
  },
  {
    "currency": "PHP",
    "country": "Philippines"
  },
  {
    "currency": "QAR",
    "country": "Qatar"
  },
  {
    "currency": "SAR",
    "country": "Saudi Arabia"
  },
  {
    "currency": "SGD",
    "country": "Singapore"
  },
  {
    "currency": "KRW",
    "country": "South Korea"
  },
  {
    "currency": "LKR",
    "country": "Sri Lanka"
  },
  {
    "currency": "TWD",
    "country": "Taiwan"
  },
  {
    "currency": "TJS",
    "country": "Tajikistan"
  },
  {
    "currency": "THB",
    "country": "Thailand"
  },
  {
    "currency": "TMT",
    "country": "Turkmenistan"
  },
  {
    "currency": "AED",
    "country": "United Arab Emirates"
  },
  {
    "currency": "UZS",
    "country": "Uzbekistan"
  },
  {
    "currency": "VND",
    "country": "Vietnam"
  },
  {
    "currency": "YER",
    "country": "Yemen"
  },
]


const EuropeCurrencies = [
  {
    "currency": "EUR",
    "country": "Europe"
  },
  {
    "currency": "RUB",
    "country": "Russia"
  },
  {
    "currency": "GBP",
    "country": "Great Britain"
  },
  {
    "currency": "ALL",
    "country": "Albania"
  },
  {
    "currency": "BAM",
    "country": "Bosnia and Herzegovina"
  },
  {
    "currency": "BGN",
    "country": "Bulgaria"
  },
  {
    "currency": "BYN",
    "country": "Belarus"
  },
  {
    "currency": "CHF",
    "country": "Switzerland"
  },
  {
    "currency": "CZK",
    "country": "Czech Republic"
  },
  {
    "currency": "DKK",
    "country": "Denmark"
  },
  {
    "currency": "HUF",
    "country": "Hungary"
  },
  {
    "currency": "ISK",
    "country": "Iceland"
  },
  {
    "currency": "MDL",
    "country": "Moldova"
  },
  {
    "currency": "MKD",
    "country": "North Macedonia"
  },
  {
    "currency": "NOK",
    "country": "Norway"
  },
  {
    "currency": "PLN",
    "country": "Poland"
  },
  {
    "currency": "RON",
    "country": "Romania"
  },
  {
    "currency": "RSD",
    "country": "Serbia"
  },
  {
    "currency": "SEK",
    "country": "Sweden"
  },
  {
    "currency": "UAH",
    "country": "Ukraine"
  }
]

export const CURRENCIES = AsiaCurrencies.map(({ currency }) => currency).concat(EuropeCurrencies.map(({ currency }) => currency));

export const currenciesWithCountry = [{ currency: defaultBaseCurrency, country: 'United States' }].concat(AsiaCurrencies).concat(EuropeCurrencies);