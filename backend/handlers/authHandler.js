// Auth handler — mimics Cognito-backed Lambda endpoints.
// POST /auth/register — SignUp
// POST /auth/login    — InitiateAuth
// GET  /auth/me       — GetUser (protected)

const { register, login, getProfile } = require("../services/authService");
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

async function registerHandler(event) {
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

    const result = await register(body.email, body.password, body.name);
    return buildResponse(201, result);
  } catch (err) {
    const status = err.status || 500;
    return buildResponse(status, { error: err.message });
  }
}

async function loginHandler(event) {
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

    const result = await login(body.email, body.password);
    return buildResponse(200, result);
  } catch (err) {
    const status = err.status || 500;
    return buildResponse(status, { error: err.message });
  }
}

async function meHandler(event) {
  try {
    const user = authenticate(event);
    const profile = getProfile(user.userId);
    return buildResponse(200, profile);
  } catch (err) {
    const status = err.status || 500;
    return buildResponse(status, { error: err.message });
  }
}

module.exports = { registerHandler, loginHandler, meHandler };
