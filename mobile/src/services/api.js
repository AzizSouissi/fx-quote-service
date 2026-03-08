// Base URL for the backend API.
// Use your computer's LAN IP so Expo Go on your phone can reach it.
// Change this if your IP changes or when deploying.
const API_BASE_URL = "http://192.168.1.15:3000";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

// --- Auth ---

export function registerUser(email, password, name) {
  return request("/auth/register", {
    method: "POST",
    body: { email, password, name },
  });
}

export function loginUser(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function getProfile(token) {
  return request("/auth/me", { token });
}

// --- Quotes ---

export function fetchQuote(amount, currency = "EUR") {
  return request("/quotes", {
    method: "POST",
    body: { amount: Number(amount), currency },
  });
}

export function createQuote(amount, currency = "EUR", token) {
  return request("/quotes/create", {
    method: "POST",
    body: { amount: Number(amount), currency },
    token,
  });
}

export function getQuote(quoteId, token) {
  return request(`/quotes/${quoteId}`, { token });
}

export function listQuotes(token) {
  return request("/quotes/list", { token });
}

// --- Transfers ---

export function createTransfer(quoteId, token) {
  return request("/transfers", {
    method: "POST",
    body: { quoteId },
    token,
  });
}

export function getTransfer(transferId, token) {
  return request(`/transfers/${transferId}`, { token });
}

export function listTransfers(token) {
  return request("/transfers/list", { token });
}
