"use client";

import React from "react";
import DashboardLibrary from "@/modules/dashboard/ui/components/dashboard-library";
import useGetSongs from "@/hooks/useGetSongs";

export const DashboardView = () => {
  const { songs } = useGetSongs();

  return (
    <div className="flex flex-col h-full gap-2 overflow-hidden">
      <div className="flex-1 overflow-auto text-white">
        <DashboardLibrary songs={songs} />
      </div>
    </div>
  );
};
