// Transfer handler — authenticated endpoints for creating and tracking transfers.
// POST /transfers       — Confirm a quote into a transfer
// GET  /transfers/:id   — Get transfer by ID
// GET  /transfers       — List user's transfers

const {
  createTransfer,
  getTransfer,
  listTransfers,
} = require("../services/transferService");
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

// POST /transfers
async function createTransferHandler(event) {
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

    if (!body.quoteId) {
      return buildResponse(400, { error: "Missing required field: quoteId" });
    }

    const transfer = createTransfer(body.quoteId, user.userId);
    return buildResponse(201, transfer);
  } catch (err) {
    const status = err.status || 500;
    return buildResponse(status, { error: err.message });
  }
}

// GET /transfers/:id
async function getTransferHandler(event) {
  try {
    const user = authenticate(event);
    const transferId = event.pathParameters?.id;

    if (!transferId) {
      return buildResponse(400, { error: "Missing transfer ID" });
    }

    const transfer = getTransfer(transferId, user.userId);
    return buildResponse(200, transfer);
  } catch (err) {
    const status = err.status || 500;
    return buildResponse(status, { error: err.message });
  }
}

// GET /transfers
async function listTransfersHandler(event) {
  try {
    const user = authenticate(event);
    const transfers = listTransfers(user.userId);
    return buildResponse(200, { transfers });
  } catch (err) {
    const status = err.status || 500;
    return buildResponse(status, { error: err.message });
  }
}

module.exports = {
  createTransferHandler,
  getTransferHandler,
  listTransfersHandler,
};
