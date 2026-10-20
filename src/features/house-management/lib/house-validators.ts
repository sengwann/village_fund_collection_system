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

// Latin letters, digits, Myanmar / Myanmar Extended-A / Extended-B blocks,
// whitespace and the separators - / . ( )
const ALLOWED_CHARS_REGEX =
  /^[A-Z0-9\u1000-\u109F\uA9E0-\uA9FF\uAA60-\uAA7F\s\-\/\.\(\)]+$/i;

// At least one letter or digit in any script (covers Myanmar letters and
// Myanmar digits U+1040-1049). Marks and punctuation alone do not count.
const MEANINGFUL_CONTENT_REGEX = /[\p{L}\p{N}]/u;

export function normalizeHouseNumber(raw: string): string {
  return raw.normalize("NFC").trim().replace(/\s+/g, " ").toUpperCase();
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
          "House number can only contain letters, numbers, spaces, hyphens, slashes, dots, and parentheses.",
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
