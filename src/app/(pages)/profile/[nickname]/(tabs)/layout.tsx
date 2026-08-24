import { ProfileNav } from "./components/profile-nav";

type ProfileTabsLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ nickname: string }>;
};

export default async function ProfileTabsLayout({
  children,
  params,
}: ProfileTabsLayoutProps) {
  const { nickname } = await params;

  return (
    <div className="py-10">
      <ProfileNav nickname={nickname} />
      {children}
    </div>
  );
}
