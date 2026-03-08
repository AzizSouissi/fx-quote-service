// Auth middleware — mimics an API Gateway Lambda Authorizer backed by Cognito.
// Extracts and verifies the JWT from the Authorization header,
// then attaches the decoded user info to the event.

const { verifyToken } = require("../utils/tokenUtils");

function authenticate(event) {
  const authHeader =
    event.headers?.Authorization || event.headers?.authorization;

  if (!authHeader) {
    const err = new Error("Missing Authorization header");
    err.status = 401;
    throw err;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    const err = new Error("Authorization header must be: Bearer <token>");
    err.status = 401;
    throw err;
  }

  try {
    const decoded = verifyToken(parts[1]);
    return {
      userId: decoded.sub,
      email: decoded.email,
    };
  } catch {
    const err = new Error("Invalid or expired token");
    err.status = 401;
    throw err;
  }
}

module.exports = { authenticate };
