"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import useUser from "@/hooks/profile/use-user";

type ProfileNavProps = {
  nickname: string;
};

const TABS = [
  { label: "Likes", path: "/likes" },
  { label: "Playlists", path: "/playlists" },
  { label: "History", path: "/history", ownerOnly: true },
  { label: "Following", path: "/following" },
  { label: "Followers", path: "/followers" },
];

const decodeNickname = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export function ProfileNav({ nickname }: ProfileNavProps) {
  const pathname = usePathname();
  const user = useUser((state) => state.user);
  const base = `/profile/${nickname}`;
  const isOwnProfile = user?.nickname === decodeNickname(nickname);

  return (
    <nav className="mb-8 flex gap-6 border-b border-border">
      {TABS.filter(({ ownerOnly }) => !ownerOnly || isOwnProfile).map(
        ({ label, path }) => {
          const href = `${base}${path}`;
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "border-b-2 border-transparent pb-3 text-sm text-muted-foreground hover:text-foreground",
                isActive && "border-primary text-foreground",
              )}
            >
              {label}
            </Link>
          );
        },
      )}
    </nav>
  );
}
