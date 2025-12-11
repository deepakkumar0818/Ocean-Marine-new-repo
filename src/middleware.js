import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes (no auth required)
  const publicRoutes = [
    "/login",
    "/signup",
    "/api/auth/login",
    "/api/auth/signup",
  ];

  if (publicRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes — require authentication
  const protectedRoutes = [
    "/dashboard",
    "/operations",
    "/pms",
    "/qhse",
    "/accounts",
    "/hr",
  ];

  // Check if the current path is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/operations/:path*",
    "/pms/:path*",
    "/qhse/:path*",
    "/accounts/:path*",
    "/hr/:path*",
    "/login",
    "/signup",
  ],
};
