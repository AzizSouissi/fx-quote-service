const {
  getRate,
  getSupportedCurrencies,
  TARGET_CURRENCY,
} = require("../utils/fxRates");
const { randomUUID } = require("crypto");
const quoteStore = require("../store/quoteStore");

function calculateQuote(amount, currency) {
  if (typeof amount !== "number" || amount <= 0) {
    const err = new Error("Amount must be a positive number");
    err.status = 422;
    throw err;
  }

  const supported = getSupportedCurrencies();
  if (!supported.includes(currency)) {
    const err = new Error(
      `Unsupported currency: ${currency}. Supported: ${supported.join(", ")}`,
    );
    err.status = 422;
    throw err;
  }

  const rateInfo = getRate(currency);

  if (amount <= rateInfo.fee) {
    const err = new Error(
      `Amount must be greater than the fee (${rateInfo.fee} ${currency})`,
    );
    err.status = 422;
    throw err;
  }

  const convertedAmount = (amount - rateInfo.fee) * rateInfo.rate;

  return {
    sourceAmount: amount,
    sourceCurrency: currency,
    targetCurrency: TARGET_CURRENCY,
    fxRate: rateInfo.rate,
    fee: rateInfo.fee,
    convertedAmount: Math.round(convertedAmount * 1000) / 1000,
    estimatedDelivery: rateInfo.estimatedDelivery,
  };
}

// Creates and persists a quote for an authenticated user
function createQuote(amount, currency, userId) {
  const quoteData = calculateQuote(amount, currency);

  const quote = quoteStore.save({
    id: randomUUID(),
    userId,
    ...quoteData,
    status: "open",
    createdAt: new Date().toISOString(),
  });

  return quote;
}

function getQuote(quoteId, userId) {
  const quote = quoteStore.findById(quoteId);

  if (!quote || quote.userId !== userId) {
    const err = new Error("Quote not found");
    err.status = 404;
    throw err;
  }

  return quote;
}

function listQuotes(userId) {
  return quoteStore.findByUserId(userId);
}

module.exports = { calculateQuote, createQuote, getQuote, listQuotes };
