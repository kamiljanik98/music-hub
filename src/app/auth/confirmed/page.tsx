import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthConfirmedPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-background px-4">
      <h1 className="text-xl font-semibold">Email confirmed</h1>
      <p className="text-center text-sm text-muted-foreground">
        Your account is ready. Welcome to MusicHub.
      </p>
      <Button asChild>
        <Link href="/">Go to MusicHub</Link>
      </Button>
    </div>
  );
}
