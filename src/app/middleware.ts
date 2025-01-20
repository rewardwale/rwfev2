// import { auth } from "./auth"; not required
import authConfig from "./auth.config";
import NextAuth from "next-auth";
const { auth } = NextAuth(authConfig);

import {
  DEFAULT_LOGIN_REDIRECT,
  PROVIDER_DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

export default auth((req:any) => {
  console.log("===path===")
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);


  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      console.log("logged in with all values",isLoggedIn,nextUrl.pathname)
      return Response.redirect(new URL(PROVIDER_DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isPublicRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return null;
});

export const config = {
  //   matcher: ["/((?!api|_next/image|favicon.ico).*)"],
  //   matcher: ["/login", "/register"],
  matcher: [`/((?!.+\\.[\\w]+$|_next).*)`, `/`, `/(api|trpc).(.*)`],
};
