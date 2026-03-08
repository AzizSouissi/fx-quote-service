const path = require("path");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDoc = YAML.load(
  path.join(__dirname, "..", "openapi", "quotes-api.yaml"),
);

const {
  registerHandler,
  loginHandler,
  meHandler,
} = require("./handlers/authHandler");
const {
  handler: quotePreviewHandler,
  createQuoteHandler,
  getQuoteHandler,
  listQuotesHandler,
} = require("./handlers/quoteHandler");
const {
  createTransferHandler,
  getTransferHandler,
  listTransfersHandler,
} = require("./handlers/transferHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Convert Express req → Lambda event, call handler, send response
function wrap(handlerFn, { pathParam } = {}) {
  return async (req, res) => {
    const event = {
      body:
        req.body && Object.keys(req.body).length
          ? JSON.stringify(req.body)
          : null,
      headers: req.headers,
      pathParameters: pathParam ? { id: req.params[pathParam] } : null,
    };

    const result = await handlerFn(event);
    res.status(result.statusCode).json(JSON.parse(result.body));
  };
}

// --- Auth ---
app.post("/auth/register", wrap(registerHandler));
app.post("/auth/login", wrap(loginHandler));
app.get("/auth/me", wrap(meHandler));

// --- Quotes ---
app.post("/quotes", wrap(quotePreviewHandler));
app.post("/quotes/create", wrap(createQuoteHandler));
app.get("/quotes/list", wrap(listQuotesHandler));
app.get("/quotes/:id", wrap(getQuoteHandler, { pathParam: "id" }));

// --- Transfers ---
app.post("/transfers", wrap(createTransferHandler));
app.get("/transfers/list", wrap(listTransfersHandler));
app.get("/transfers/:id", wrap(getTransferHandler, { pathParam: "id" }));

app.listen(PORT, () => {
  console.log(`FX Quote Service running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/docs`);
  console.log("Endpoints:");
  console.log("  POST /auth/register   — Create account");
  console.log("  POST /auth/login      — Get JWT token");
  console.log("  GET  /auth/me         — Profile (auth)");
  console.log("  POST /quotes          — Anonymous quote preview");
  console.log("  POST /quotes/create   — Save quote (auth)");
  console.log("  GET  /quotes/list     — List quotes (auth)");
  console.log("  GET  /quotes/:id      — Get quote (auth)");
  console.log("  POST /transfers       — Confirm transfer (auth)");
  console.log("  GET  /transfers/list  — List transfers (auth)");
  console.log("  GET  /transfers/:id   — Get transfer (auth)");
});
