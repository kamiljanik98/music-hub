"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Disc3, FileMusic, Menu, Search, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthModal from "@/hooks/auth/use-auth-dialog";
import useUser from "@/hooks/profile/use-user";
import { SearchInput } from "./search-input";
import { UserProfileButton } from "./user-profile-button";

const iconLink =
  "flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--mh-glass-hover)] hover:text-primary";

export default function Navbar() {
  const user = useUser((state) => state.user);
  const router = useRouter();
  const { open } = useAuthModal();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <div className="flex min-w-0 flex-1 items-center gap-2 md:flex-none md:gap-8">
                <Link
                  href="/"
                  className="hidden shrink-0 items-center gap-2.5 rounded-full md:flex"
                >
                  <Image
                    src="/brand/logo.svg"
                    alt="App logo"
                    width={28}
                    height={28}
                  />

                  <p className="font-display text-base uppercase tracking-[0.1em] text-foreground">
                    MusicHub
                  </p>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMenuOpen}
                  className={`${iconLink}  hover:text-primary md:hidden`}
                >
                  {isMenuOpen ? (
                    <X className="size-7" />
                  ) : (
                    <Menu className="size-7" />
                  )}
                </button>

                <div className="hidden shrink-0 items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                  <Link
                    href="/feed"
                    className="transition-colors hover:text-primary"
                  >
                    Feed
                  </Link>

                  <Link
                    href="/library"
                    className="transition-colors hover:text-primary"
                  >
                    Library
                  </Link>
                </div>
              </div>

              <div className="hidden w-full min-w-0 justify-self-center md:block md:w-[420px]">
                <Suspense fallback={null}>
                  <SearchInput />
                </Suspense>
              </div>

              <div className="ml-auto flex shrink-0 items-center gap-1 md:hidden">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search"
                  className={`${iconLink} mr-3`}
                >
                  <Search className="size-6" />
                </button>

                {user ? (
                  <UserProfileButton />
                ) : (
                  <Button
                    size="sm"
                    className="font-semibold"
                    onClick={() => open("register")}
                  >
                    Sign In
                  </Button>
                )}
              </div>

              {user ? (
                <div className="hidden shrink-0 items-center justify-end gap-2 md:flex md:gap-3">
                  <Button
                    size="sm"
                    className="py-3 text-sm font-semibold"
                    onClick={() => router.push("/upload")}
                  >
                    Upload
                  </Button>

                  <UserProfileButton />
                </div>
              ) : (
                <div className="hidden shrink-0 items-center justify-end gap-2 md:flex md:gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
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

              {isMenuOpen && (
                <div className="absolute left-0 top-full w-full border-b border-white/6 bg-[rgba(15,15,15,0.97)] px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.55)] md:hidden">
                  <div className="flex flex-col">
                    <Link
                      href="/feed"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-muted-foreground hover:bg-[var(--mh-glass-hover)] hover:text-primary"
                    >
                      <Disc3 className="size-5" />
                      Feed
                    </Link>

                    <Link
                      href="/library"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-muted-foreground hover:bg-[var(--mh-glass-hover)] hover:text-primary"
                    >
                      <FileMusic className="size-5" />
                      Library
                    </Link>

                    {user && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push("/upload");
                        }}
                        className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-muted-foreground hover:bg-[var(--mh-glass-hover)] hover:text-primary"
                      >
                        <Upload className="size-5" />
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
