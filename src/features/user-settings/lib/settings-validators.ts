import "server-only";
import { LanguagePreference } from "@prisma/client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_ALLOWED_CHARACTERS_REGEX = /^[0-9+\-\s()]+$/;
const PHONE_NORMALIZED_REGEX = /^\+?\d{5,15}$/;
const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

// ── Collector KPay Info ────────────────────────────────────────────
export type KpayInfoField = "kpayAccountName" | "kpayAccountNumber";

export interface NormalizedKpayInfoInput {
  kpayAccountName: string;
  kpayAccountNumber: string;
}

export type KpayInfoValidationResult =
  | { ok: true; data: NormalizedKpayInfoInput }
  | {
      ok: false;
      fieldErrors: Partial<Record<KpayInfoField, string>>;
      formError?: string;
    };

export function validateKpayInfoInput(
  formData: FormData,
): KpayInfoValidationResult {
  const fieldErrors: Partial<Record<KpayInfoField, string>> = {};
  const rawName = getFormDataString(formData, "kpayAccountName");
  const rawNumber = getFormDataString(formData, "kpayAccountNumber");

  // KPay Account Name: required, trimmed, 2–100 chars
  const kpayAccountName = rawName.trim();
  if (!kpayAccountName) {
    fieldErrors.kpayAccountName = "KPay account name is required.";
  } else if (kpayAccountName.length < 2 || kpayAccountName.length > 100) {
    fieldErrors.kpayAccountName =
      "KPay account name must be between 2 and 100 characters.";
  }

  let kpayAccountNumber = "";
  const trimmedNumber = rawNumber.trim();
  if (!trimmedNumber) {
    fieldErrors.kpayAccountNumber = "KPay account number is required.";
  } else if (!PHONE_ALLOWED_CHARACTERS_REGEX.test(trimmedNumber)) {
    fieldErrors.kpayAccountNumber = "KPay account number is invalid.";
  } else {
    const normalized = trimmedNumber.replace(/[\s\-().]/g, "");
    if (!PHONE_NORMALIZED_REGEX.test(normalized)) {
      fieldErrors.kpayAccountNumber = "KPay account number is invalid.";
    } else {
      kpayAccountNumber = normalized;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }
  return { ok: true, data: { kpayAccountName, kpayAccountNumber } };
}

// ── Profile ─────────────────────────────────────────────────────

export type ProfileField =
  | "name"
  | "email"
  | "phone"
  | "identifier"
  | "dateOfBirth";

export interface NormalizedProfileInput {
  name: string;
  email: string | null;
  phone: string | null;
  dateOfBirth: Date | null;
}

export type ProfileValidationResult =
  | { ok: true; data: NormalizedProfileInput }
  | {
      ok: false;
      fieldErrors: Partial<Record<ProfileField, string>>;
      formError?: string;
    };

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value;
  }
  return "";
}

function parseOptionalDate(raw: string): Date | null {
  if (!raw || !raw.trim()) return null;
  const trimmed = raw.trim();
  if (!DATE_REGEX.test(trimmed)) return null;
  const date = new Date(trimmed + "T00:00:00Z");
  if (isNaN(date.getTime())) return null;
  if (date > new Date()) return null;
  if (date < new Date("1900-01-01")) return null;
  return date;
}

export function validateProfileInput(
  formData: FormData,
): ProfileValidationResult {
  const fieldErrors: Partial<Record<ProfileField, string>> = {};

  const rawName = getFormDataString(formData, "name");
  const rawEmail = getFormDataString(formData, "email").trim();
  const rawPhone = getFormDataString(formData, "phone").trim();
  const rawDateOfBirth = getFormDataString(formData, "dateOfBirth");

  const name = rawName.trim();
  if (name.length < 2 || name.length > 100) {
    fieldErrors.name = "Name must be between 2 and 100 characters.";
  }

  let email: string | null = null;
  let phone: string | null = null;

  if (rawEmail) {
    const normalizedEmail = rawEmail.toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      fieldErrors.email = "Email is invalid.";
    } else {
      email = normalizedEmail;
    }
  }

  if (rawPhone) {
    if (!PHONE_ALLOWED_CHARACTERS_REGEX.test(rawPhone)) {
      fieldErrors.phone = "Phone number is invalid.";
    } else {
      const normalizedPhone = rawPhone.replace(/[\s\-().]/g, "");
      if (!PHONE_NORMALIZED_REGEX.test(normalizedPhone)) {
        fieldErrors.phone = "Phone number is invalid.";
      } else {
        phone = normalizedPhone;
      }
    }
  }

  if (!rawEmail && !rawPhone) {
    fieldErrors.identifier =
      "Provide at least one login identifier: email or phone.";
  }

  let dateOfBirth: Date | null = null;
  if (rawDateOfBirth.trim()) {
    dateOfBirth = parseOptionalDate(rawDateOfBirth);
    if (!dateOfBirth) {
      fieldErrors.dateOfBirth =
        "Date of birth is invalid. It cannot be in the future.";
    }
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return { ok: true, data: { name, email, phone, dateOfBirth } };
}

// ── Password ────────────────────────────────────────────────────

export type PasswordField =
  | "currentPassword"
  | "newPassword"
  | "confirmPassword";

export interface NormalizedPasswordInput {
  currentPassword: string;
  newPassword: string;
}

export type PasswordValidationResult =
  | { ok: true; data: NormalizedPasswordInput }
  | {
      ok: false;
      fieldErrors: Partial<Record<PasswordField, string>>;
      formError?: string;
    };

export function validatePasswordInput(
  formData: FormData,
): PasswordValidationResult {
  const fieldErrors: Partial<Record<PasswordField, string>> = {};

  const currentPassword = getFormDataString(formData, "currentPassword");
  const newPassword = getFormDataString(formData, "newPassword");
  const confirmPassword = getFormDataString(formData, "confirmPassword");

  if (!currentPassword) {
    fieldErrors.currentPassword = "Current password is required.";
  }

  if (newPassword.length < 8 || newPassword.length > 72) {
    fieldErrors.newPassword =
      "New password must be between 8 and 72 characters.";
  }

  if (newPassword !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    fieldErrors.newPassword =
      "New password must be different from current password.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return { ok: true, data: { currentPassword, newPassword } };
}

// ── Settings (Theme + Language) ─────────────────────────────────

export type SettingsField = "theme" | "language";

export interface NormalizedSettingsInput {
  language: LanguagePreference;
}

export type SettingsValidationResult =
  | { ok: true; data: NormalizedSettingsInput }
  | {
      ok: false;
      fieldErrors: Partial<Record<SettingsField, string>>;
      formError?: string;
    };

const VALID_LANGUAGES = Object.values(LanguagePreference) as string[];

export function validateSettingsInput(
  formData: FormData,
): SettingsValidationResult {
  const fieldErrors: Partial<Record<SettingsField, string>> = {};

  const rawTheme = getFormDataString(formData, "theme");
  const rawLanguage = getFormDataString(formData, "language");

  if (!VALID_LANGUAGES.includes(rawLanguage)) {
    fieldErrors.language = "Invalid language selection.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    data: {
      language: rawLanguage as LanguagePreference,
    },
  };
}
