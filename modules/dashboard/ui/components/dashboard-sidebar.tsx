import UploadButton from "@/components/common/UploadButton";
import SidebarItem from "@/components/SidebarItem";
import { DashboardUserButton } from "@/modules/dashboard/ui/components/dashboard-user-button";
import { IconType } from "react-icons/lib";
import Image from "next/image";
type Props = {
  routes: Array<{
    icon: IconType;
    label: string;
    active: boolean;
    href: string;
  }>;
};

export const DashboardSidebar = ({ routes }: Props) => {
  return (
    <div className="hidden md:flex flex-col w-72 h-full bg-neutral-900 rounded-lg p-4 text-white gap-4 shadow-lg">
      <div className="flex items-center gap-4 py-2">
        <Image className="py-2 ml-1" src="/logo.svg" width={32} height={32} alt="Logo" />
        <p className="font-semibold text-lg text-green-400">Music-Hub</p>
      </div>
      <UploadButton />
      {routes.map((item) => (
        <SidebarItem key={item.label} {...item} />
      ))}
      <div className="mt-auto">
        <DashboardUserButton />
      </div>
    </div>
  );
};
