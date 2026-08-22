"use server";

import { createClient } from "@/lib/supabase/server";
import { MutationResult } from "@/types";

export async function changePassword({
  currentPassword,
  password,
}: {
  currentPassword: string;
  password: string;
}): Promise<MutationResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return { error: new Error("Not authenticated") };

  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (reauthError) {
    return { error: new Error("Current password is incorrect") };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  return { error };
}
