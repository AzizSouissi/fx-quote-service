// Auth service — mimics Cognito user management operations.
// Register = Cognito SignUp + AdminConfirmSignUp
// Login    = Cognito InitiateAuth (USER_PASSWORD_AUTH flow)

const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const userStore = require("../store/userStore");
const { signToken } = require("../utils/tokenUtils");

const SALT_ROUNDS = 10;

async function register(email, password, name) {
  if (!email || !password || !name) {
    const err = new Error("Missing required fields: email, password, name");
    err.status = 400;
    throw err;
  }

  if (password.length < 8) {
    const err = new Error("Password must be at least 8 characters");
    err.status = 422;
    throw err;
  }

  const existing = userStore.findByEmail(email);
  if (existing) {
    const err = new Error("A user with this email already exists");
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = userStore.create({
    id: randomUUID(),
    email: email.toLowerCase(),
    name,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

async function login(email, password) {
  if (!email || !password) {
    const err = new Error("Missing required fields: email, password");
    err.status = 400;
    throw err;
  }

  const user = userStore.findByEmail(email);
  if (!user) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const token = signToken({ id: user.id, email: user.email });

  return {
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: 3600,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

function getProfile(userId) {
  const user = userStore.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

module.exports = { register, login, getProfile };
