import "server-only";

export const AUTH_COOKIE_NAME = "vfcs_session";

export const AUTH_SESSION_MAX_AGE_DAYS = 7;

export const AUTH_SESSION_MAX_AGE_SECONDS =
  AUTH_SESSION_MAX_AGE_DAYS * 24 * 60 * 60;

export const LOGIN_ROUTE = "/login";

export const DEFAULT_POST_LOGIN_ROUTE = "/dashboard";
