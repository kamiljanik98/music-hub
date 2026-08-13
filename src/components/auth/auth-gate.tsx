"use client";

import { Button } from "@/components/ui/button";
import useAuthDialog from "@/hooks/auth/use-auth-dialog";

type AuthGateProps = {
  message: string;
};

export function AuthGate({ message }: AuthGateProps) {
  const open = useAuthDialog((state) => state.open);

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button onClick={() => open()}>Sign in</Button>
    </div>
  );
}
