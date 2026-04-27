import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isPrivatePath(pathname: string) {
  return pathname.startsWith("/notes") || pathname.startsWith("/profile");
}

function isAuthPath(pathname: string) {
  return pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  if (!isAuthenticated && isPrivatePath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

