import { getProfileByNickname } from "@/actions/profile/get-profile-by-nickname";
import { ChangePasswordForm } from "@/components/profile/edit/change-password-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type SettingsPageProps = {
  params: Promise<{ nickname: string }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { nickname } = await params;

  const supabase = await createClient();
  const { data: profile, error: profileError } =
    await getProfileByNickname(nickname);

  if (profileError) {
    return <p className="text-destructive">Failed to load profile</p>;
  }

  if (!profile) {
    return notFound();
  }

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isOwnProfile = currentUser?.id === profile.id;

  if (!isOwnProfile) return notFound();

  return (
    <div>
      <h1>Settings</h1>
      <ChangePasswordForm />
    </div>
  );
}
