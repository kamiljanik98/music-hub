"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
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
      <div className="w-full border-b border-white/16 bg-[rgba(15,15,15,0.85)] shadow-[0_10px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-[24px] backdrop-saturate-[1.4]">
        <div className="mx-auto grid w-full max-w-[var(--mh-content-max)] grid-cols-[1fr_auto_1fr] items-center gap-6 px-4 py-4">
          {/* Logo + navigation */}
          <div className="flex min-w-0 items-center gap-8">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2.5 rounded-full"
            >
              <Image src="/logo.svg" alt="App logo" width={28} height={28} />

              <p className="font-display text-base uppercase tracking-[0.1em] text-foreground">
                MusicHub
              </p>
            </Link>

            <div className="flex shrink-0 items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link
                href="/feed"
                className="flex items-center gap-1.5 hover:text-primary"
              >
                Feed
              </Link>

              <Link
                href="/library"
                className="flex items-center gap-1.5 hover:text-primary"
              >
                Library
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="w-full min-w-0 justify-self-center md:w-[420px]">
            <Suspense fallback={null}>
              <SearchInput />
            </Suspense>
          </div>

          {/* Actions */}
          {user ? (
            <div className="flex shrink-0 items-center justify-end gap-3">
              <Button
                size="sm"
                className="font-semibold text-sm py-3"
                onClick={() => router.push("/upload")}
              >
                Upload
              </Button>

              <UserProfileButton />
            </div>
          ) : (
            <div className="flex shrink-0 items-center justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => open("login")}>
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
      </div>
    </nav>
  );
}
