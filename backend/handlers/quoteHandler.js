const {
  calculateQuote,
  createQuote,
  getQuote,
  listQuotes,
} = require("../services/quoteService");
const { authenticate } = require("../middleware/authMiddleware");

function buildResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}

// POST /quotes (public — anonymous quote preview)
async function handler(event) {
  try {
    if (!event.body) {
      return buildResponse(400, { error: "Request body is required" });
    }

    let body;
    try {
      body = JSON.parse(event.body);
    } catch {
      return buildResponse(400, { error: "Invalid JSON in request body" });
    }

    if (body.amount === undefined || body.amount === null) {
      return buildResponse(400, { error: "Missing required field: amount" });
    }
    if (!body.currency) {
      return buildResponse(400, { error: "Missing required field: currency" });
    }

    const quote = calculateQuote(body.amount, body.currency);
    return buildResponse(200, quote);
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    return buildResponse(status, { error: message });
  }
}

// POST /quotes/create (authenticated — persists quote)
async function createQuoteHandler(event) {
  try {
    const user = authenticate(event);

    if (!event.body) {
      return buildResponse(400, { error: "Request body is required" });
    }

    let body;
    try {
      body = JSON.parse(event.body);
    } catch {
      return buildResponse(400, { error: "Invalid JSON in request body" });
    }

    if (body.amount === undefined || body.amount === null) {
      return buildResponse(400, { error: "Missing required field: amount" });
    }
    if (!body.currency) {
      return buildResponse(400, { error: "Missing required field: currency" });
    }

    const quote = createQuote(body.amount, body.currency, user.userId);
    return buildResponse(201, quote);
  } catch (err) {
    const status = err.status || 500;
    return buildResponse(status, { error: err.message });
  }
}

// GET /quotes/:id (authenticated)
async function getQuoteHandler(event) {
  try {
    const user = authenticate(event);
    const quoteId = event.pathParameters?.id;

    if (!quoteId) {
      return buildResponse(400, { error: "Missing quote ID" });
    }

    const quote = getQuote(quoteId, user.userId);
    return buildResponse(200, quote);
  } catch (err) {
    const status = err.status || 500;
    return buildResponse(status, { error: err.message });
  }
}

// GET /quotes (authenticated — list user's quotes)
async function listQuotesHandler(event) {
  try {
    const user = authenticate(event);
    const quotes = listQuotes(user.userId);
    return buildResponse(200, { quotes });
  } catch (err) {
    const status = err.status || 500;
    return buildResponse(status, { error: err.message });
  }
}

module.exports = {
  handler,
  createQuoteHandler,
  getQuoteHandler,
  listQuotesHandler,
};
