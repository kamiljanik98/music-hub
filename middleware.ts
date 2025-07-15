import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const token = request.cookies.get(`sb-${process.env.PROJECT_REF}-auth-token`)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}
 
export const config = {
  matcher: '/dashboard/:path*',
}