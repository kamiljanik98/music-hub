"use client";

import { useState } from "react";
import { FollowingCard } from "./following-card";
import type { ProfileSummary } from "@/types";

type FollowingUser = ProfileSummary & {
  followerCount?: number;
  trackCount?: number;
};

export const FollowingList = ({ users }: { users: FollowingUser[] }) => {
  const [rows] = useState(users);

  return (
    <>
      <div className="mb-8 border-b border-border pb-4 text-right">
        <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          NETWORK / FOLLOWING
        </p>

        <div className="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-2">
          <h1 className="font-display text-4xl leading-none tracking-tight uppercase text-foreground md:text-6xl">
            FOLLOWING
          </h1>

          <p className="font-mono text-lg tabular-nums text-muted-foreground md:text-2xl">
            [{rows.length.toString().padStart(3, "0")}]
          </p>
        </div>
      </div>

      {rows.length ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rows.map((user) => (
            <FollowingCard
              key={user.id}
              user={user}
              followerCount={user.followerCount}
              trackCount={user.trackCount}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nobody here yet.</p>
      )}
    </>
  );
};
