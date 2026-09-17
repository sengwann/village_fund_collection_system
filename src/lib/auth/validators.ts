import "server-only";

import { DEFAULT_POST_LOGIN_ROUTE } from "./auth.constants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_ALLOWED_CHARACTERS_REGEX = /^[0-9+\-\s()]+$/;

const PHONE_NORMALIZED_REGEX = /^\+?\d{5,15}$/;

export type NormalizedIdentifier =
  | {
      type: "email";
      value: string;
    }
  | {
      type: "phone";
      value: string;
    };

export function normalizeIdentifier(
  rawIdentifier: string,
): NormalizedIdentifier | null {
  const identifier = rawIdentifier.trim();

  if (!identifier || identifier.length > 191) {
    return null;
  }

  if (identifier.includes("@")) {
    const email = identifier.toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
      return null;
    }

    return {
      type: "email",
      value: email,
    };
  }

  if (!PHONE_ALLOWED_CHARACTERS_REGEX.test(identifier)) {
    return null;
  }

  const phone = identifier.replace(/[\s\-().]/g, "");

  if (!PHONE_NORMALIZED_REGEX.test(phone)) {
    return null;
  }

  return {
    type: "phone",
    value: phone,
  };
}

export type LoginValidationResult =
  | {
      ok: true;
      data: {
        identifier: NormalizedIdentifier;
        password: string;
        redirectTo?: string;
      };
    }
  | {
      ok: false;
      error: string;
    };

export function validateLoginInput(input: {
  identifier?: unknown;
  password?: unknown;
  redirectTo?: unknown;
}): LoginValidationResult {
  const identifier =
    typeof input.identifier === "string" ? input.identifier : "";

  const password = typeof input.password === "string" ? input.password : "";

  const redirectTo =
    typeof input.redirectTo === "string" && input.redirectTo.length > 0
      ? input.redirectTo
      : undefined;

  const invalidResult: LoginValidationResult = {
    ok: false,
    error: "Invalid credentials.",
  };

  if (!identifier || !password) {
    return invalidResult;
  }

  const normalizedIdentifier = normalizeIdentifier(identifier);

  if (!normalizedIdentifier) {
    return invalidResult;
  }

  if (password.length > 200) {
    return invalidResult;
  }

  return {
    ok: true,
    data: {
      identifier: normalizedIdentifier,
      password,
      redirectTo,
    },
  };
}

export function getSafeRedirectPath(rawRedirect?: string): string {
  if (!rawRedirect) {
    return DEFAULT_POST_LOGIN_ROUTE;
  }

  const path = rawRedirect.trim();

  if (!path.startsWith("/")) {
    return DEFAULT_POST_LOGIN_ROUTE;
  }

  if (path.startsWith("//")) {
    return DEFAULT_POST_LOGIN_ROUTE;
  }

  if (path.includes("\\")) {
    return DEFAULT_POST_LOGIN_ROUTE;
  }

  if (path.toLowerCase() === "/login") {
    return DEFAULT_POST_LOGIN_ROUTE;
  }

  return path;
}
