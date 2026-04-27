import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkSessionForProxy } from "./lib/api/serverApi";

function isPrivatePath(pathname: string) {
  return pathname.startsWith("/notes") || pathname.startsWith("/profile");
}

function isAuthPath(pathname: string) {
  return pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
}

async function readCookieValue(req: NextRequest, name: string) {
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    return store.get(name)?.value;
  } catch {
    return req.cookies.get(name)?.value;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = await readCookieValue(req, "accessToken");
  const refreshToken = await readCookieValue(req, "refreshToken");

  let isAuthenticated = Boolean(accessToken);
  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const refreshed = await checkSessionForProxy(cookieHeader);
    for (const cookieStr of refreshed.setCookies) response.headers.append("set-cookie", cookieStr);

    isAuthenticated = refreshed.success;
  }

  if (!isAuthenticated && isPrivatePath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = "";
    const redirectRes = NextResponse.redirect(url);
    for (const [k, v] of response.headers) {
      if (k.toLowerCase() === "set-cookie") redirectRes.headers.append(k, v);
    }
    return redirectRes;
  }

  if (isAuthenticated && isAuthPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    const redirectRes = NextResponse.redirect(url);
    for (const [k, v] of response.headers) {
      if (k.toLowerCase() === "set-cookie") redirectRes.headers.append(k, v);
    }
    return redirectRes;
  }

  return response;
}

