"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { FaHome, FaSearch } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";

import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import DashboardSidebarOverlay from "@/modules/dashboard/ui/components/dashboard-sidebar-overlay";
import PlayerView from "@/modules/player/ui/views/player-view";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        icon: FaHome,
        label: "Dashboard",
        active: pathname === "/dashboard",
        href: "/dashboard",
      },
      {
        icon: FaSearch,
        label: "Search",
        active: pathname === "/search",
        href: "/search",
      },
      {
        icon: FaGear,
        label: "Settings",
        active: pathname === "/settings",
        href: "/settings",
      },
    ],
    [pathname],
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden gap-2 p-2">
      <div className="md:hidden flex items-center justify-between w-full p-4 bg-neutral-900 text-white rounded-lg">
        <div className="flex items-center gap-4 py-2">
          <Image src="/logo.svg" width={24} height={24} alt="Logo" />
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="text-white text-2xl"
        >
          <FiMenu />
        </button>
      </div>

      <div className="flex flex-1 relative min-h-0 overflow-hidden rounded-lg bg-muted">
        <aside
          className="hidden md:flex w-72 shrink-0 rounded-lg p-4 bg-neutral-900 text-white gap-4"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <DashboardSidebar routes={routes} />
        </aside>

        <main className="flex-1 overflow-y-auto md:pl-2 min-h-0" style={{ paddingBottom: "64px" }}>
          {children}
        </main>

        <DashboardSidebarOverlay
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          routes={routes}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-5">
        <PlayerView />
      </div>
    </div>
  );
};

export default Layout;
