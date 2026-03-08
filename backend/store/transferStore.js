// In-memory transfer store — simulates DynamoDB or similar.

const transfers = new Map();

function save(transfer) {
  transfers.set(transfer.id, transfer);
  return transfer;
}

function findById(id) {
  return transfers.get(id) || null;
}

function findByUserId(userId) {
  const result = [];
  for (const transfer of transfers.values()) {
    if (transfer.userId === userId) {
      result.push(transfer);
    }
  }
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function clear() {
  transfers.clear();
}

module.exports = { save, findById, findByUserId, clear };
