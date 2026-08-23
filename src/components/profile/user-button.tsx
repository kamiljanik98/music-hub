"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CircleUserRound,
  Heart,
  LogOut,
  Settings,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
      <DropdownMenuTrigger className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
        <Image
          src={getAvatarUrl(user.avatar_url)}
          alt={user.nickname ?? "User avatar"}
          width={36}
          height={36}
          className="size-full rounded-full object-cover"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.nickname}`}>
            <CircleUserRound />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.nickname}/likes`}>
            <Heart />
            Likes
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.nickname}/following`}>
            <UserRoundCheck />
            Following
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.nickname}/followers`}>
            <UsersRound />
            Followers
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.nickname}/settings`}>
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-destructive"
        >
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
