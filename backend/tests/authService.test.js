const { register, login, getProfile } = require("../services/authService");
const userStore = require("../store/userStore");
const { verifyToken } = require("../utils/tokenUtils");

beforeEach(() => {
  userStore.clear();
});

describe("register", () => {
  test("creates a new user and returns profile", async () => {
    const result = await register(
      "test@example.com",
      "password123",
      "Test User",
    );

    expect(result.id).toBeDefined();
    expect(result.email).toBe("test@example.com");
    expect(result.name).toBe("Test User");
    expect(result.createdAt).toBeDefined();
    expect(result.password).toBeUndefined();
  });

  test("normalizes email to lowercase", async () => {
    const result = await register("TEST@Example.COM", "password123", "Test");
    expect(result.email).toBe("test@example.com");
  });

  test("throws 400 for missing fields", async () => {
    await expect(register(null, "pass", "name")).rejects.toThrow(
      "Missing required fields",
    );
    await expect(register("e@e.com", null, "name")).rejects.toThrow(
      "Missing required fields",
    );
    await expect(register("e@e.com", "pass", null)).rejects.toThrow(
      "Missing required fields",
    );
  });

  test("throws 422 for short password", async () => {
    await expect(register("e@e.com", "short", "name")).rejects.toThrow(
      "Password must be at least 8 characters",
    );
  });

  test("throws 409 for duplicate email", async () => {
    await register("dup@example.com", "password123", "First");
    await expect(
      register("dup@example.com", "password123", "Second"),
    ).rejects.toThrow("A user with this email already exists");
  });
});

describe("login", () => {
  beforeEach(async () => {
    await register("user@example.com", "password123", "Test User");
  });

  test("returns token and user on valid credentials", async () => {
    const result = await login("user@example.com", "password123");

    expect(result.accessToken).toBeDefined();
    expect(result.tokenType).toBe("Bearer");
    expect(result.expiresIn).toBe(3600);
    expect(result.user.email).toBe("user@example.com");

    const decoded = verifyToken(result.accessToken);
    expect(decoded.sub).toBe(result.user.id);
    expect(decoded.email).toBe("user@example.com");
    expect(decoded.token_use).toBe("access");
  });

  test("throws 400 for missing fields", async () => {
    await expect(login(null, "pass")).rejects.toThrow(
      "Missing required fields",
    );
    await expect(login("e@e.com", null)).rejects.toThrow(
      "Missing required fields",
    );
  });

  test("throws 401 for wrong email", async () => {
    await expect(login("wrong@example.com", "password123")).rejects.toThrow(
      "Invalid email or password",
    );
  });

  test("throws 401 for wrong password", async () => {
    await expect(login("user@example.com", "wrongpass")).rejects.toThrow(
      "Invalid email or password",
    );
  });
});

describe("getProfile", () => {
  test("returns profile for existing user", async () => {
    const registered = await register("me@example.com", "password123", "Me");
    const profile = getProfile(registered.id);

    expect(profile.id).toBe(registered.id);
    expect(profile.email).toBe("me@example.com");
    expect(profile.name).toBe("Me");
    expect(profile.password).toBeUndefined();
  });

  test("throws 404 for non-existent user", () => {
    expect(() => getProfile("non-existent-id")).toThrow("User not found");
  });
});
