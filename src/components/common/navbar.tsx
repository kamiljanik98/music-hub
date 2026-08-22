"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CloudUpload } from "lucide-react";
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
    <nav className="sticky top-4 z-35">
      <div className="mx-auto flex max-w-[var(--mh-content-max)] flex-wrap items-center gap-3 rounded-[var(--mh-radius-pill)] border border-border bg-card px-3.5 py-2.5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image src="/logo.svg" alt="App logo" width={50} height={50} />
          <p className="font-display text-base uppercase tracking-[0.1em] text-foreground">
            MusicHub
          </p>
        </Link>

        <div className="flex shrink-0 gap-4 text-[13px] font-medium text-muted-foreground">
          <Link href="/feed">Feed</Link>
          <Link href="/library">Library</Link>
        </div>

        <div className="min-w-0 flex-1">
          <SearchInput />
        </div>

        {user ? (
          <div className="flex shrink-0 items-center gap-4">
            <Button
              variant="ghost"
              className="p-3 gap-2 text-muted-foreground active:scale-95"
              onClick={() => router.push("/upload")}
            >
              <CloudUpload className="size-5" />
              Upload
            </Button>
            <UserProfileButton />
          </div>
        ) : (
          <div className="flex shrink-0 gap-4">
            <Button onClick={() => open("login")}>Sign in</Button>
            <Button
              variant="secondary"
              className="font-semibold"
              onClick={() => open("register")}
            >
              Create account
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
