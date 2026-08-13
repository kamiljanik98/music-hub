import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthConfirmedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-4 font-sans dark:bg-black">
      <h1 className="text-xl font-semibold">Email confirmed</h1>
      <p className="text-center text-sm text-zinc-500">
        Your account is ready. Welcome to MusicHub.
      </p>
      <Button asChild>
        <Link href="/">Go to MusicHub</Link>
      </Button>
    </div>
  );
}
