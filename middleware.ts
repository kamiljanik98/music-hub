import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/search", "/settings"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = new URL("/", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return res;
  }

  return NextResponse.next();
}
