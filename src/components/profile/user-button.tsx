"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  LogOut,
  Settings,
  User2Icon,
  UserRoundCheck,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUser from "@/hooks/profile/use-user";
import useSignOut from "@/hooks/auth/use-sign-out";
import { getAvatarUrl } from "@/lib/r2/public";

export const UserProfileButton = () => {
  const user = useUser((state) => state.user);
  const { signOut } = useSignOut();

  if (!user) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm text-neutral-300 hover:text-neutral-100 transition-colors cursor-pointer outline-none">
        <div className="size-8 rounded-full overflow-hidden shrink-0">
          <Image
            src={getAvatarUrl(user.avatar_url)}
            alt={user.nickname ?? "User avatar"}
            width={24}
            height={24}
            className="size-full object-cover"
          />
        </div>
        <span>{user.nickname ?? "No nickname"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem asChild>
          <Link
            href={`/profile/${user.nickname}`}
            className="flex items-center gap-2"
          >
            <User2Icon size={14} />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/profile/${user.nickname}/following`}
            className="flex items-center gap-2"
          >
            <UserRoundCheck size={14} />
            Following
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/profile/${user.nickname}/likes`}
            className="flex items-center gap-2"
          >
            <Heart size={14} />
            Likes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/profile/${user.nickname}/followers`}
            className="flex items-center gap-2"
          >
            <Users size={14} />
            Followers
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={`/profile/${user.nickname}/settings`}
            className="flex items-center gap-2"
          >
            <Settings size={14} />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut()}
          className="flex items-center gap-2 text-destructive"
        >
          <LogOut size={14} />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
