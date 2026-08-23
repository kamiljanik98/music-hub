"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CloudUpload, Disc3, FileMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthModal from "@/hooks/auth/use-auth-dialog";
import useUser from "@/hooks/profile/use-user";
import { SearchInput } from "../search/search-input";
import { UserProfileButton } from "../profile/user-button";

export default function Navbar() {
  const user = useUser((state) => state.user);
  const router = useRouter();
  const { open } = useAuthModal();

  return (
    <nav className="sticky top-0 z-35">
      <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-white/16 bg-[rgba(15,15,15,0.85)] px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-[24px] backdrop-saturate-[1.4]">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-full"
        >
          <Image src="/logo.svg" alt="App logo" width={28} height={28} />

          <p className="font-display text-base uppercase tracking-[0.1em] text-foreground">
            MusicHub
          </p>
        </Link>

        {/* Navigation + search */}
        <div className="flex w-full min-w-0 items-center gap-6">
          <div className="flex shrink-0 items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link
              href="/feed"
              className="flex items-center gap-1.5 hover:text-primary"
            >
              <Disc3 size={16} /> Feed
            </Link>

            <Link
              href="/library"
              className="flex items-center gap-1.5 hover:text-primary"
            >
              <FileMusic size={16} /> Library
            </Link>
          </div>

          <div className="min-w-0 max-w-[320px] flex-1">
            <SearchInput />
          </div>
        </div>

        {/* Actions */}
        {user ? (
          <div className="flex shrink-0 items-center gap-3 pr-2">
            <Button
              size="sm"
              className="px-5 py-2 text-sm font-semibold"
              onClick={() => router.push("/upload")}
            >
              Upload
            </Button>

            <UserProfileButton />
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-8">
            <Button
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={() => open("login")}
            >
              Login
            </Button>

            <Button
              size="sm"
              className="font-semibold"
              onClick={() => open("register")}
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
