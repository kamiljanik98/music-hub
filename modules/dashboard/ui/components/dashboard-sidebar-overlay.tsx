"use client";

import { FaTimes } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import SidebarItem from "@/components/SidebarItem";
import LogoutButton from "@/components/common/LogoutButton";
import { DashboardUserButton } from "@/modules/dashboard/ui/components/dashboard-user-button";
import UploadButton from "@/components/common/UploadButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  routes: Array<{
    icon: IconType;
    label: string;
    active: boolean;
    href: string;
  }>;
};

const DashboardSidebarOverlay = ({ isOpen, onClose, routes }: Props) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        className={`fixed top-0 left-0 h-screen w-3/4 max-w-sm z-50 bg-neutral-900 text-white transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 overflow-hidden">
          <button
            className="absolute right-4 top-4 text-white text-2xl"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>

          <div className="pt-16 pb-6">
            <DashboardUserButton isMobile />
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto pb-4">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} onClick={onClose} />
            ))}
          </div>

          <UploadButton />
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebarOverlay;
