import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthConfirmedPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-background px-4">
      <CheckCircle2 className="size-12 text-primary" strokeWidth={1.5} />

      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Email confirmed
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Your email address has been successfully verified. You can now log in
          to your MusicHub account.
        </p>
      </div>

      <Button asChild>
        <Link href="/">Log in to MusicHub</Link>
      </Button>
    </div>
  );
}
