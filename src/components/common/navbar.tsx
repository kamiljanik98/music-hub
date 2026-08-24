"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Disc3, FileMusic, Search, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthModal from "@/hooks/auth/use-auth-dialog";
import useUser from "@/hooks/profile/use-user";
import { SearchInput } from "./search-input";
import { UserProfileButton } from "./user-profile-button";

const iconLink =
  "flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--mh-glass-hover)] hover:text-primary";

const navLink =
  "flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--mh-glass-hover)] hover:text-primary md:size-auto md:rounded-none md:hover:bg-transparent";

export default function Navbar() {
  const user = useUser((state) => state.user);
  const router = useRouter();
  const { open } = useAuthModal();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-35">
      <div className="w-full border-b border-white/6 bg-[rgba(15,15,15,0.85)] shadow-[0_10px_40px_rgba(0,0,0,0.55)] mh-glass">
        <div className="mx-auto flex w-full max-w-[var(--mh-content-max)] items-center gap-3 px-4 py-3 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6 md:py-4">
          {isSearchOpen ? (
            <div className="flex w-full items-center gap-2 md:hidden">
              <div className="min-w-0 flex-1">
                <Suspense fallback={null}>
                  <SearchInput />
                </Suspense>
              </div>

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                className={iconLink}
              >
                <X className="size-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex min-w-0 flex-1 items-center gap-4 md:flex-none md:gap-8">
                <Link
                  href="/"
                  className="flex shrink-0 items-center gap-2.5 rounded-full"
                >
                  <Image src="/logo.svg" alt="App logo" width={28} height={28} />

                  <p className="hidden font-display text-base uppercase tracking-[0.1em] text-foreground sm:block">
                    MusicHub
                  </p>
                </Link>

                <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground md:gap-6">
                  <Link href="/feed" aria-label="Feed" className={navLink}>
                    <Disc3 className="size-5 md:hidden" />
                    <span className="hidden md:inline">Feed</span>
                  </Link>

                  <Link
                    href="/library"
                    aria-label="Library"
                    className={navLink}
                  >
                    <FileMusic className="size-5 md:hidden" />
                    <span className="hidden md:inline">Library</span>
                  </Link>
                </div>
              </div>

              <div className="hidden w-full min-w-0 justify-self-center md:block md:w-[420px]">
                <Suspense fallback={null}>
                  <SearchInput />
                </Suspense>
              </div>

              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className={`${iconLink} md:hidden`}
              >
                <Search className="size-5" />
              </button>

              {user ? (
                <div className="flex shrink-0 items-center justify-end gap-2 md:gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/upload")}
                    aria-label="Upload"
                    className={`${iconLink} md:hidden`}
                  >
                    <Upload className="size-5" />
                  </button>

                  <Button
                    size="sm"
                    className="hidden py-3 text-sm font-semibold md:inline-flex"
                    onClick={() => router.push("/upload")}
                  >
                    Upload
                  </Button>

                  <UserProfileButton />
                </div>
              ) : (
                <div className="flex shrink-0 items-center justify-end gap-2 md:gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:inline-flex"
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
