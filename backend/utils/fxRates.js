// Supported FX rates and fee schedule.
// In production this would call an external rates provider.

const RATES = {
  EUR_TND: { rate: 3.35, fee: 2.5, estimatedDelivery: "5 minutes" },
  USD_TND: { rate: 3.1, fee: 3.0, estimatedDelivery: "5 minutes" },
  GBP_TND: { rate: 3.9, fee: 2.0, estimatedDelivery: "10 minutes" },
};

const TARGET_CURRENCY = "TND";

function getRate(sourceCurrency) {
  const key = `${sourceCurrency}_${TARGET_CURRENCY}`;
  return RATES[key] || null;
}

function getSupportedCurrencies() {
  return Object.keys(RATES).map((key) => key.split("_")[0]);
}

module.exports = { getRate, getSupportedCurrencies, TARGET_CURRENCY };
