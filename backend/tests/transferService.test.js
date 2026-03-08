const {
  createTransfer,
  getTransfer,
  listTransfers,
} = require("../services/transferService");
const { createQuote } = require("../services/quoteService");
const quoteStore = require("../store/quoteStore");
const transferStore = require("../store/transferStore");

const TEST_USER_ID = "user-abc-123";
const OTHER_USER_ID = "user-xyz-999";

beforeEach(() => {
  quoteStore.clear();
  transferStore.clear();
});

describe("createTransfer", () => {
  test("creates a transfer from an open quote", () => {
    const quote = createQuote(100, "EUR", TEST_USER_ID);

    const transfer = createTransfer(quote.id, TEST_USER_ID);

    expect(transfer.id).toBeDefined();
    expect(transfer.quoteId).toBe(quote.id);
    expect(transfer.userId).toBe(TEST_USER_ID);
    expect(transfer.sourceAmount).toBe(100);
    expect(transfer.sourceCurrency).toBe("EUR");
    expect(transfer.convertedAmount).toBe(326.625);
    expect(transfer.status).toBe("pending");
    expect(transfer.createdAt).toBeDefined();
  });

  test("marks the quote as confirmed", () => {
    const quote = createQuote(100, "EUR", TEST_USER_ID);
    createTransfer(quote.id, TEST_USER_ID);

    const updatedQuote = quoteStore.findById(quote.id);
    expect(updatedQuote.status).toBe("confirmed");
  });

  test("throws 409 if quote already used for a transfer", () => {
    const quote = createQuote(100, "EUR", TEST_USER_ID);
    createTransfer(quote.id, TEST_USER_ID);

    expect(() => createTransfer(quote.id, TEST_USER_ID)).toThrow(
      "This quote has already been used for a transfer",
    );
  });

  test("throws 404 for non-existent quote", () => {
    expect(() => createTransfer("no-such-id", TEST_USER_ID)).toThrow(
      "Quote not found",
    );
  });

  test("throws 404 when user does not own the quote", () => {
    const quote = createQuote(100, "EUR", TEST_USER_ID);

    expect(() => createTransfer(quote.id, OTHER_USER_ID)).toThrow(
      "Quote not found",
    );
  });
});

describe("getTransfer", () => {
  test("returns transfer by ID for the owning user", () => {
    const quote = createQuote(50, "GBP", TEST_USER_ID);
    const transfer = createTransfer(quote.id, TEST_USER_ID);

    const result = getTransfer(transfer.id, TEST_USER_ID);
    expect(result.id).toBe(transfer.id);
    expect(result.sourceCurrency).toBe("GBP");
  });

  test("throws 404 for another user", () => {
    const quote = createQuote(50, "GBP", TEST_USER_ID);
    const transfer = createTransfer(quote.id, TEST_USER_ID);

    expect(() => getTransfer(transfer.id, OTHER_USER_ID)).toThrow(
      "Transfer not found",
    );
  });

  test("throws 404 for non-existent transfer", () => {
    expect(() => getTransfer("nope", TEST_USER_ID)).toThrow(
      "Transfer not found",
    );
  });
});

describe("listTransfers", () => {
  test("returns all transfers for a user", () => {
    const q1 = createQuote(100, "EUR", TEST_USER_ID);
    const q2 = createQuote(200, "USD", TEST_USER_ID);
    createTransfer(q1.id, TEST_USER_ID);
    createTransfer(q2.id, TEST_USER_ID);

    const transfers = listTransfers(TEST_USER_ID);
    expect(transfers).toHaveLength(2);
  });

  test("returns empty array for user with no transfers", () => {
    const transfers = listTransfers(TEST_USER_ID);
    expect(transfers).toEqual([]);
  });

  test("does not return other users' transfers", () => {
    const q1 = createQuote(100, "EUR", TEST_USER_ID);
    createTransfer(q1.id, TEST_USER_ID);

    const transfers = listTransfers(OTHER_USER_ID);
    expect(transfers).toEqual([]);
  });
});
