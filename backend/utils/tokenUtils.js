// JWT helpers — mimics Cognito token issuance and verification.
// In production, Cognito signs tokens with RSA keys and you verify
// against the JWKS endpoint. Here we use a symmetric secret for simplicity.

const jwt = require("jsonwebtoken");

// In production this would be a Cognito app client secret or RSA key pair.
const JWT_SECRET = "fx-quote-local-dev-secret";
const TOKEN_EXPIRY = "1h";

function signToken(payload) {
  return jwt.sign(
    {
      sub: payload.id,
      email: payload.email,
      token_use: "access", // Cognito uses this claim
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY },
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken, JWT_SECRET };
