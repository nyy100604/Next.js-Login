import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const { pathname } = req.nextUrl;
  console.log(pathname);

  console.log("isLoggedIn", isLoggedIn);

  const loginUrl = new URL("/login", req.url);
  const dashboardUrl = new URL("/dashboard", req.url);

  // If the user is not logged in and tries to access protected routes, redirect to login
  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(loginUrl);
  }

  // If the user is logged in and tries to access the login page, redirect to dashboard
  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow the request to proceed as usual
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    "/dashboard/:path*",
    "/login",
  ],
};
