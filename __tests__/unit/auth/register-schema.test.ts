import { describe, it, expect } from "vitest";
import { registerSchema } from "@/lib/validations/auth";

describe("registerSchema - email", () => {
  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      email: "not-an-email",
      nickname: "validnick",
      password: "ValidPass1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "email")).toBe(true);
    }
  });

  it("accepts a valid email", () => {
    const result = registerSchema.safeParse({
      email: "valid@example.com",
      nickname: "validnick",
      password: "ValidPass1",
    });
    expect(result.success).toBe(true);
  });
});

describe("registerSchema - nickname", () => {
  it("rejects nickname under 3 characters", () => {
    const result = registerSchema.safeParse({
      email: "valid@example.com",
      nickname: "ab",
      password: "ValidPass1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "nickname")).toBe(
        true,
      );
    }
  });

  it("accepts nickname at exactly 3 characters (boundary)", () => {
    const result = registerSchema.safeParse({
      email: "valid@example.com",
      nickname: "abc",
      password: "ValidPass1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects nickname over 32 characters", () => {
    const result = registerSchema.safeParse({
      email: "valid@example.com",
      nickname: "a".repeat(33),
      password: "ValidPass1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "nickname")).toBe(
        true,
      );
    }
  });

  it("accepts nickname at exactly 32 characters (boundary)", () => {
    const result = registerSchema.safeParse({
      email: "valid@example.com",
      nickname: "a".repeat(32),
      password: "ValidPass1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects nickname with disallowed characters (space, diacritics)", () => {
    const invalidNicknames = ["jan kowalski", "jankówalski"];
    for (const nickname of invalidNicknames) {
      const result = registerSchema.safeParse({
        email: "valid@example.com",
        nickname,
        password: "ValidPass1",
      });
      expect(result.success).toBe(false);
    }
  });

  it("accepts nickname with letters, numbers, underscores, dots and dashes (Discord format)", () => {
    const validNicknames = ["jan_kowalski_99", "jan.kowalski", "jan-kowalski"];
    for (const nickname of validNicknames) {
      const result = registerSchema.safeParse({
        email: "valid@example.com",
        nickname,
        password: "ValidPass1",
      });
      expect(result.success).toBe(true);
    }
  });
});

describe("registerSchema - password", () => {
  it("rejects password under 6 characters", () => {
    const result = registerSchema.safeParse({
      email: "valid@example.com",
      nickname: "validnick",
      password: "Ab1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "password")).toBe(
        true,
      );
    }
  });

  it("accepts password at exactly 6 characters (boundary)", () => {
    const result = registerSchema.safeParse({
      email: "valid@example.com",
      nickname: "validnick",
      password: "Abcde1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects password without an uppercase letter", () => {
    const result = registerSchema.safeParse({
      email: "valid@example.com",
      nickname: "validnick",
      password: "validpass1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "password")).toBe(
        true,
      );
    }
  });

  it("rejects password without a number", () => {
    const result = registerSchema.safeParse({
      email: "valid@example.com",
      nickname: "validnick",
      password: "ValidPass",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "password")).toBe(
        true,
      );
    }
  });

  it("rejects password missing both uppercase and number", () => {
    const result = registerSchema.safeParse({
      email: "valid@example.com",
      nickname: "validnick",
      password: "lowercase",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordIssues = result.error.issues.filter(
        (i) => i.path[0] === "password",
      );
      expect(passwordIssues.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("accepts a fully valid password", () => {
    const result = registerSchema.safeParse({
      email: "valid@example.com",
      nickname: "validnick",
      password: "ValidPass1",
    });
    expect(result.success).toBe(true);
  });
});
