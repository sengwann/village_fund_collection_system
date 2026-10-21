import "server-only";

export const AUTH_COOKIE_NAME = "vfcs_session";

export const AUTH_SESSION_MAX_AGE_DAYS = 7;

export const AUTH_SESSION_MAX_AGE_SECONDS =
  AUTH_SESSION_MAX_AGE_DAYS * 24 * 60 * 60;

export const LOGIN_ROUTE = "/login";

export const DEFAULT_POST_LOGIN_ROUTE = "/dashboard";

/** The single generic message for every failed sign-in (no enumeration). */
export const AUTH_INVALID_CREDENTIALS_MESSAGE = "Invalid credentials.";

/** Message returned while a sign-in is temporarily throttled. */
export const AUTH_THROTTLED_MESSAGE = "Too many sign-in attempts.";

/*
 * Login throttling. An attempt is counted before the password is checked.
 * Attempts 1..max are allowed; attempt max+1 starts the cooldown.
 */
export const LOGIN_THROTTLE_WINDOW_SECONDS = 15 * 60;

export const LOGIN_THROTTLE_COOLDOWN_SECONDS = 15 * 60;

/** Per account (or identifier) per client IP. */
export const LOGIN_THROTTLE_IDENTIFIER_MAX_ATTEMPTS = 5;

/** Per client IP across all accounts. */
export const LOGIN_THROTTLE_IP_MAX_ATTEMPTS = 30;

/** Throttle rows untouched for this long are deleted opportunistically. */
export const LOGIN_THROTTLE_RETENTION_SECONDS = 24 * 60 * 60;
