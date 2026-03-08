// Transfer service — handles confirming a quote into a live transfer.

const { randomUUID } = require("crypto");
const quoteStore = require("../store/quoteStore");
const transferStore = require("../store/transferStore");

const VALID_STATUSES = ["pending", "processing", "completed", "failed"];

function createTransfer(quoteId, userId) {
  const quote = quoteStore.findById(quoteId);

  if (!quote) {
    const err = new Error("Quote not found");
    err.status = 404;
    throw err;
  }

  if (quote.userId !== userId) {
    const err = new Error("Quote not found");
    err.status = 404;
    throw err;
  }

  // Check if quote has already been used
  if (quote.status === "confirmed") {
    const err = new Error("This quote has already been used for a transfer");
    err.status = 409;
    throw err;
  }

  // Mark quote as confirmed
  quote.status = "confirmed";
  quoteStore.save(quote);

  const transfer = transferStore.save({
    id: randomUUID(),
    quoteId: quote.id,
    userId,
    sourceAmount: quote.sourceAmount,
    sourceCurrency: quote.sourceCurrency,
    targetCurrency: quote.targetCurrency,
    fxRate: quote.fxRate,
    fee: quote.fee,
    convertedAmount: quote.convertedAmount,
    status: "pending",
    estimatedDelivery: quote.estimatedDelivery,
    createdAt: new Date().toISOString(),
  });

  return transfer;
}

function getTransfer(transferId, userId) {
  const transfer = transferStore.findById(transferId);

  if (!transfer || transfer.userId !== userId) {
    const err = new Error("Transfer not found");
    err.status = 404;
    throw err;
  }

  return transfer;
}

function listTransfers(userId) {
  return transferStore.findByUserId(userId);
}

module.exports = { createTransfer, getTransfer, listTransfers };
