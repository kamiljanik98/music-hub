"use client";

import LogoutButton from "@/components/common/LogoutButton";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useState } from "react";

export const DashboardUserButton = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { userDetails, uploadsCount } = useUser();
  const [expanded, setExpanded] = useState(false);

  const toggleDetails = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div
      onClick={toggleDetails}
      className={`
        ${isMobile ? "flex" : "hidden md:flex"}
        flex-col gap-2 p-3 rounded-xl border border-neutral-700 bg-neutral-800/50
        cursor-pointer hover:border-white transition
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {userDetails?.avatar_url ? (
            <Image
              src={userDetails.avatar_url}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border border-neutral-700 object-cover"
              width={40}
              height={40}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-neutral-700" />
          )}

          <div className="flex flex-col">
            <p className="text-sm font-semibold text-white">{userDetails?.nickname || "No name"}</p>
            <p className="text-xs text-neutral-400">{userDetails?.role || "unidentified"}</p>
          </div>
        </div>
        {!isMobile && <LogoutButton />}
      </div>

      <div
        className={`
          text-xs text-neutral-400 pl-1 transition-all duration-300 ease-out
          ${isMobile || expanded ? "max-h-28 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}
        `}
      >
        <p className="m-0 leading-tight">
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
        <p className="m-0 leading-tight mt-1">
          Uploads:{" "}
          <span className="text-green-600">
            {typeof uploadsCount === "number" ? uploadsCount : "loading..."}
          </span>
        </p>
      </div>
    </div>
  );
};
