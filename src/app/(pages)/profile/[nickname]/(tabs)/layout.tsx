import { Tabs } from "@/components/profile/tabs";

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
    <div className="px-6 py-10">
      <Tabs nickname={nickname} />
      {children}
    </div>
  );
}
