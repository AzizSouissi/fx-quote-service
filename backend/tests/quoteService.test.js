const { calculateQuote } = require("../services/quoteService");

describe("calculateQuote", () => {

  test("returns correct quote for 100 EUR", () => {
    const quote = calculateQuote(100, "EUR");

    expect(quote.sourceAmount).toBe(100);
    expect(quote.sourceCurrency).toBe("EUR");
    expect(quote.targetCurrency).toBe("TND");
    expect(quote.fxRate).toBe(3.35);
    expect(quote.fee).toBe(2.5);
    expect(quote.convertedAmount).toBe(326.625);
    expect(quote.estimatedDelivery).toBe("5 minutes");
  });

  test("returns correct quote for USD", () => {
    const quote = calculateQuote(200, "USD");

    expect(quote.sourceCurrency).toBe("USD");
    expect(quote.fxRate).toBe(3.1);
    expect(quote.fee).toBe(3.0);
    expect(quote.convertedAmount).toBe((200 - 3.0) * 3.1);
  });

  test("returns correct quote for GBP", () => {
    const quote = calculateQuote(50, "GBP");

    expect(quote.sourceCurrency).toBe("GBP");
    expect(quote.fxRate).toBe(3.9);
    expect(quote.fee).toBe(2.0);
    expect(quote.convertedAmount).toBe((50 - 2.0) * 3.9);
  });

  test("throws 422 for negative amount", () => {
    expect(() => calculateQuote(-10, "EUR")).toThrow(
      "Amount must be a positive number",
    );
  });

  test("throws 422 for zero amount", () => {
    expect(() => calculateQuote(0, "EUR")).toThrow(
      "Amount must be a positive number",
    );
  });

  test("throws 422 for non-number amount", () => {
    expect(() => calculateQuote("abc", "EUR")).toThrow(
      "Amount must be a positive number",
    );
  });

  test("throws 422 for unsupported currency", () => {
    expect(() => calculateQuote(100, "XYZ")).toThrow(
      "Unsupported currency: XYZ",
    );
  });

  test("throws 422 when amount is less than or equal to fee", () => {
    expect(() => calculateQuote(2.5, "EUR")).toThrow(
      "Amount must be greater than the fee",
    );
    expect(() => calculateQuote(1, "EUR")).toThrow(
      "Amount must be greater than the fee",
    );
  });

  test("handles large amounts correctly", () => {
    const quote = calculateQuote(1000000, "EUR");
    expect(quote.convertedAmount).toBe((1000000 - 2.5) * 3.35);
  });

  test("handles small valid amounts", () => {
    const quote = calculateQuote(3, "EUR");
    expect(quote.convertedAmount).toBeCloseTo((3 - 2.5) * 3.35, 3);
  });
});
