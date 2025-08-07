"use client";

import LogoutButton from "@/components/common/LogoutButton";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";

export const DashboardUserButton = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { userDetails } = useUser();

  return (
    <div
      className={`
        ${isMobile ? "flex" : "hidden md:flex"}
        flex-col p-3 rounded-xl border border-neutral-700 bg-neutral-800/50
        max-w-full
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        {userDetails?.avatar_url ? (
          <Image
            src={userDetails.avatar_url}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border border-neutral-700 object-cover flex-shrink-0"
            width={40}
            height={40}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-neutral-700 flex-shrink-0" />
        )}

        <div className="flex flex-col flex-grow min-w-0 overflow-hidden">
          <p className="text-sm font-semibold text-white truncate">{userDetails?.nickname || "No name"}</p>
          <p className="text-xs text-neutral-400 truncate">{userDetails?.role || "unidentified"}</p>
        </div>

        <div className="flex-shrink-0">
          <LogoutButton />
        </div>
      </div>

      <p className="text-xs text-neutral-400 pl-1 mt-2 truncate">
        Member since:{" "}
        <span className="text-green-600">
          {userDetails?.created_at
            ? new Date(userDetails.created_at).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })
            : "unknown"}
        </span>
      </p>
    </div>
  );
};
