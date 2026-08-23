"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useAuthModal from "@/hooks/auth/use-auth-dialog";
import useUser from "@/hooks/profile/use-user";

export const BannerCta = () => {
  const user = useUser((state) => state.user);
  const open = useAuthModal((state) => state.open);
  const router = useRouter();

  const handleUpload = () => {
    if (!user) {
      open("register");
      return;
    }

    router.push("/upload");
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
      <Button asChild>
        <Link href="/search?query=synthwave">Start listening free</Link>
      </Button>

      <Button variant="outline" onClick={handleUpload}>
        I make music
      </Button>
    </div>
  );
};
