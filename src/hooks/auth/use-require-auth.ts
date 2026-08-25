"use client";

import useUser from "@/hooks/profile/use-user";
import useAuthModal from "./use-auth-dialog";

export function useRequireAuth() {
  const user = useUser((state) => state.user);
  const isLoading = useUser((state) => state.isLoading);
  const open = useAuthModal((state) => state.open);

  return () => {
    if (isLoading) return false;
    if (user) return true;
    open();
    return false;
  };
}
