import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const SUPABASE_URL = "http://localhost:54321";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const MAILPIT_URL = "http://localhost:54324";
const APP_URL = "http://localhost:3000";

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

function randomEmail() {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

async function getLatestConfirmUrlFor(email: string): Promise<string> {
  const searchRes = await fetch(
    `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`,
  );
  const searchData = await searchRes.json();
  if (!searchData.messages?.length) {
    throw new Error(`No email found for ${email}`);
  }

  const latestId = searchData.messages[0].ID;
  const messageRes = await fetch(`${MAILPIT_URL}/api/v1/message/${latestId}`);
  const message = await messageRes.json();

  const match = (message.Text as string).match(
    /(http:\/\/localhost:3000\/auth\/confirm\?token_hash=[^\s&]+&type=signup)/,
  );
  if (!match) {
    throw new Error("No confirm URL found in email Text body");
  }
  return match[1];
}

describe("register flow (PKCE) integration", () => {
  it("registers, confirms email, and signs in", async () => {
    const email = randomEmail();
    const password = "TestPassword123!";
    const nickname = `user${Date.now()}`;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: { data: { nickname } },
      },
    );
    expect(signUpError).toBeNull();
    expect(signUpData.user).not.toBeNull();

    const confirmUrl = await getLatestConfirmUrlFor(email);

    const confirmRes = await fetch(confirmUrl, { redirect: "manual" });
    expect(confirmRes.status).toBe(307);
    expect(confirmRes.headers.get("location")).toBe("/auth/confirmed");

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    expect(signInError).toBeNull();
    expect(signInData.session).not.toBeNull();
  });

  it("resolves the confirmation link without a redirect loop", async () => {
    const email = randomEmail();
    const password = "TestPassword123!";
    const nickname = `loop${Date.now()}`;

    await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    });
    const confirmUrl = await getLatestConfirmUrlFor(email);

    const res = await fetch(confirmUrl, { redirect: "manual" });
    const location = res.headers.get("location") ?? "";

    expect(location).toBe("/auth/confirmed");
    expect(res.status).toBe(307);
  });

  it("lands on /auth/confirmed on success, not /", async () => {
    const email = randomEmail();
    const password = "TestPassword123!";
    const nickname = `land${Date.now()}`;

    await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    });
    const confirmUrl = await getLatestConfirmUrlFor(email);

    const res = await fetch(confirmUrl, { redirect: "manual" });
    expect(res.headers.get("location")).toBe("/auth/confirmed");
  });

  it("redirects to /auth/error when token_hash/type are missing or verifyOtp fails", async () => {
    const missingParamsRes = await fetch(`${APP_URL}/auth/confirm`, {
      redirect: "manual",
    });
    expect(missingParamsRes.headers.get("location")).toBe("/auth/error");

    const invalidTokenRes = await fetch(
      `${APP_URL}/auth/confirm?token_hash=invalid_token_hash_12345&type=signup`,
      { redirect: "manual" },
    );
    expect(invalidTokenRes.headers.get("location")).toBe("/auth/error");
  });
});
