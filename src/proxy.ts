import { type NextRequest } from "next/server";
import { PROTECTED_PATHS, updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: PROTECTED_PATHS,
};
