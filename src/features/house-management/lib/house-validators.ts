import "server-only";

export type HouseField = "houseNumber";

export interface NormalizedHouseInput {
  houseNumber: string;
}

export type HouseValidationResult =
  | { ok: true; data: NormalizedHouseInput }
  | {
      ok: false;
      fieldErrors: Partial<Record<HouseField, string>>;
      formError?: string;
    };

const ALLOWED_CHARS_REGEX =
  /^[A-Z0-9\u1000-\u109F\uA9E0-\uA9FF\uAA60-\uAA7F\s\-\/\.\(\)]+$/i;
const MEANINGFUL_CONTENT_REGEX = /[A-Z0-9]/;

export function normalizeHouseNumber(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").toUpperCase();
}

export function validateHouseNumber(raw: string): HouseValidationResult {
  const normalized = normalizeHouseNumber(raw);

  if (!normalized) {
    return {
      ok: false,
      fieldErrors: { houseNumber: "House number is required." },
    };
  }

  if (normalized.length < 2 || normalized.length > 30) {
    return {
      ok: false,
      fieldErrors: {
        houseNumber: "House number must be between 2 and 30 characters.",
      },
    };
  }

  if (!ALLOWED_CHARS_REGEX.test(normalized)) {
    return {
      ok: false,
      fieldErrors: {
        houseNumber:
          "House number can only contain letters, numbers, spaces, hyphens, slashes, and dots.",
      },
    };
  }

  if (!MEANINGFUL_CONTENT_REGEX.test(normalized)) {
    return {
      ok: false,
      fieldErrors: {
        houseNumber: "House number must contain at least one letter or number.",
      },
    };
  }

  return { ok: true, data: { houseNumber: normalized } };
}
