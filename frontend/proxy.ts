import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

export default async function proxy(request: NextRequest) {
  const session = await getSession(request);
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isLoginPage && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
