"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type TabsProps = {
  nickname: string;
};

const TABS = [
  { label: "Likes", path: "/likes" },
  { label: "Following", path: "/following" },
  { label: "Followers", path: "/followers" },
];

export function Tabs({ nickname }: TabsProps) {
  const pathname = usePathname();
  const base = `/profile/${nickname}`;

  return (
    <nav className="mb-8 flex gap-6 border-b border-border">
      {TABS.map(({ label, path }) => {
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
      })}
    </nav>
  );
}
