// In-memory user store — mimics a Cognito User Pool.
// In production this would be Cognito's managed user directory.

const users = new Map();

function findByEmail(email) {
  return users.get(email.toLowerCase()) || null;
}

function findById(id) {
  for (const user of users.values()) {
    if (user.id === id) return user;
  }
  return null;
}

function create(user) {
  const key = user.email.toLowerCase();
  if (users.has(key)) {
    return null; // already exists
  }
  users.set(key, user);
  return user;
}

function clear() {
  users.clear();
}

module.exports = { findByEmail, findById, create, clear };
