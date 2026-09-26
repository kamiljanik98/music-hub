import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const SUPABASE_URL = "http://localhost:54321";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const MAILPIT_URL = "http://localhost:54324";

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

function randomEmail() {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

async function registerAndConfirm(
  email: string,
  password: string,
  nickname: string,
) {
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  });
  if (signUpError) throw signUpError;

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

  await fetch(match[1], { redirect: "manual" });
}

describe("login flow integration", () => {
  it("logs in with confirmed credentials", async () => {
    const email = randomEmail();
    const password = "TestPassword123";
    const nickname = `login${Date.now()}`;

    await registerAndConfirm(email, password, nickname);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    expect(error).toBeNull();
    expect(data.session).not.toBeNull();
  });

  it("return an error for wrong password", async () => {
    const email = randomEmail();
    const password = "TestPassword123";
    const nickname = `wrong${Date.now()}`;

    await registerAndConfirm(email, password, nickname);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: "WrongPassword000!",
    });

    expect(error).not.toBeNull();
    expect(data.session).toBeNull();
  });

  it("returns an error for an unconfirmed account", async () => {
    const email = randomEmail();
    const password = "TestPassword123";
    const nickname = `unconfirmed${Date.now()}`;

    const { error: LoginError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    });
    if (LoginError) throw LoginError;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    expect(error).not.toBeNull();
    expect(data.session).toBeNull();
  });
});
