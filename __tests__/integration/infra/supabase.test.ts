import { describe, it, expect } from "vitest";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

describe("Supabase client connection", () => {
  it.each(["songs", "profiles", "stems"] as const)(
    "%s table returns an aray, not an error",
    async (table) => {
      const { data, error } = await supabase.from(table).select("*");
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    },
  );
});

describe("RLS - unauthenticated insert is blocked", () => {
  it("cannot insert into songs", async () => {
    const { error } = await supabase.from("songs").insert({
      title: "test",
      path: "test",
      uploaded_by: crypto.randomUUID(),
    });
    expect(error).not.toBeNull();
  });

  it("cannot insert into stems", async () => {
    const { error } = await supabase.from("stems").insert({
      song_id: crypto.randomUUID(),
      category: "drums",
      path: "test",
    });
    expect(error).not.toBeNull();
  });

  it("cannot insert into profiles", async () => {
    const { error } = await supabase.from("profiles").insert({
      id: crypto.randomUUID(),
      nickname: "test",
    });
    expect(error).not.toBeNull();
  });
});

describe("RLS - unauthenticated is allowed (public read)", () => {
  it.each(["songs", "profiles", "stems"] as const)(
    "can select from %s",
    async (table) => {
      const { error } = await supabase.from(table).select("*");
      expect(error).toBeNull();
    },
  );
});
