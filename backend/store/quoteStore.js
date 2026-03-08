// In-memory quote store — simulates DynamoDB or similar.

const quotes = new Map();

function save(quote) {
  quotes.set(quote.id, quote);
  return quote;
}

function findById(id) {
  return quotes.get(id) || null;
}

function findByUserId(userId) {
  const result = [];
  for (const quote of quotes.values()) {
    if (quote.userId === userId) {
      result.push(quote);
    }
  }
  // Most recent first
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function clear() {
  quotes.clear();
}

module.exports = { save, findById, findByUserId, clear };
