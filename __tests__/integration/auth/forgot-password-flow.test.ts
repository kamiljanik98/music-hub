import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const SUPABASE_URL = "http://localhost:54321";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const MAILPIT_URL = "http://localhost:54324";
const APP_URL = "http://localhost:3000";

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

function randomEmail() {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2)}@mail.com`;
}

async function registerAndConfirm(
  email: string,
  password: string,
  nickname: string,
) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  });

  if (error) throw error;

  const searchRes = await fetch(
    `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`,
  );
  const searchData = await searchRes.json();
  if (!searchData.messages?.length)
    throw new Error(`No email found for ${email}`);

  const messageRes = await fetch(
    `${MAILPIT_URL}/api/v1/message/${searchData.messages[0].ID}`,
  );
  const message = await messageRes.json();

  const match = (message.Text as string).match(
    /(http:\/\/localhost:3000\/auth\/confirm\?token_hash=[^\s&]+&type=signup)/,
  );
  if (!match) throw new Error("No confirm URL found in email");

  await fetch(match[1], { redirect: "manual" });
}

async function getRecoveryUrlFor(email: string): Promise<string> {
  const searchRes = await fetch(
    `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`,
  );
  const searchData = await searchRes.json();
  if (!searchData.messages?.length)
    throw new Error(`No email found for ${email}`);

  for (const msg of searchData.messages) {
    const messageRes = await fetch(`${MAILPIT_URL}/api/v1/message/${msg.ID}`);
    const message = await messageRes.json();
    const match = (message.Text as string).match(
      /(http:\/\/localhost:3000\/auth\/confirm\?token_hash=[^\s&]+&type=recovery)/,
    );
    if (match) return match[1];
  }

  throw new Error("No recovery URL found in any email");
}

describe("forgot password flow integration", () => {
  it("sends reset email and returns success state", async () => {
    const email = randomEmail();
    await registerAndConfirm(email, "TestPassword123", `fp${Date.now()}`);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${APP_URL}/auth/update-password`,
    });
    expect(error).toBeNull();
    const recoveryUrl = await getRecoveryUrlFor(email);
    expect(recoveryUrl).toMatch(/token_hash=.+&type=recovery/);
  });

  it("recovery links redirects to /auth/update-password", async () => {
    const email = randomEmail();
    await registerAndConfirm(email, "TestPassword123", `fp${Date.now()}`);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${APP_URL}/auth/update-password`,
    });
    const recoveryUrl = await getRecoveryUrlFor(email);
    const res = await fetch(recoveryUrl, { redirect: "manual" });
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("/auth/update-password");
  });
});
