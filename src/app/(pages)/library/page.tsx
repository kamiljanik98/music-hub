import { redirect } from "next/navigation";
import { AuthGate } from "@/components/auth/auth-gate";
import { createClient } from "@/lib/supabase/server";

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return <AuthGate message="Sign in to see your library." />;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", currentUser.id)
    .single();

  if (error || !profile?.nickname) {
    return <p className="text-destructive">Failed to load your library</p>;
  }

  redirect(`/profile/${profile.nickname}/likes`);
}
