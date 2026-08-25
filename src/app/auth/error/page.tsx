import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-background px-4">
      <h1 className="text-xl font-semibold">Link expired or invalid</h1>
      <p className="text-center text-sm text-muted-foreground">
        This confirmation link is no longer valid. It may have expired or
        already been used.
      </p>
      <Button asChild>
        <Link href="/">Back to MusicHub</Link>
      </Button>
    </div>
  );
}
