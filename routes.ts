//Array of routes accessible only to public, this doesnt require authentication
export const publicRoutes = ["/", "/new-verification"];

export const authRoutes = [
  "/login",
  "/signup",
  "/error",
  "/reset",
  "/reset-password",
  "/social-signup"
];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/home";

export const PROVIDER_DEFAULT_LOGIN_REDIRECT = "/social-signup";