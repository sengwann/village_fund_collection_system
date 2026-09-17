import "server-only";

const VILLAGE_CODE_REGEX = /^[A-Z0-9]{3,20}$/;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_ALLOWED_CHARACTERS_REGEX = /^[0-9+\-\s()]+$/;

const PHONE_NORMALIZED_REGEX = /^\+?\d{5,15}$/;

export type CreateVillageField =
  | "villageCode"
  | "villageName"
  | "chiefName"
  | "chiefEmail"
  | "chiefPhone"
  | "chiefIdentifier"
  | "chiefPassword";

export interface NormalizedCreateVillageInput {
  villageCode: string;
  villageName: string;
  chiefName: string;
  chiefEmail: string | null;
  chiefPhone: string | null;
  chiefPassword: string;
}

export type CreateVillageValidationResult =
  | {
      ok: true;
      data: NormalizedCreateVillageInput;
    }
  | {
      ok: false;
      fieldErrors: Partial<Record<CreateVillageField, string>>;
      formError?: string;
    };

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value === "string") {
    return value;
  }

  return "";
}

export function validateCreateVillageInput(
  formData: FormData,
): CreateVillageValidationResult {
  const fieldErrors: Partial<Record<CreateVillageField, string>> = {};

  const rawVillageCode = getFormDataString(formData, "villageCode");
  const rawVillageName = getFormDataString(formData, "villageName");
  const rawChiefName = getFormDataString(formData, "chiefName");
  const rawChiefEmail = getFormDataString(formData, "chiefEmail").trim();
  const rawChiefPhone = getFormDataString(formData, "chiefPhone").trim();
  const rawChiefPassword = getFormDataString(formData, "chiefPassword");

  const villageCode = rawVillageCode.trim().toUpperCase().replace(/\s+/g, "");

  if (!VILLAGE_CODE_REGEX.test(villageCode)) {
    fieldErrors.villageCode =
      "Village code must be 3 to 20 characters and use letters or numbers only.";
  }

  const villageName = rawVillageName.trim();

  if (villageName.length < 2 || villageName.length > 100) {
    fieldErrors.villageName =
      "Village name must be between 2 and 100 characters.";
  }

  const chiefName = rawChiefName.trim();

  if (chiefName.length < 2 || chiefName.length > 100) {
    fieldErrors.chiefName = "Chief name must be between 2 and 100 characters.";
  }

  let chiefEmail: string | null = null;
  let chiefPhone: string | null = null;

  if (rawChiefEmail) {
    const email = rawChiefEmail.toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
      fieldErrors.chiefEmail = "Chief email is invalid.";
    } else {
      chiefEmail = email;
    }
  }

  if (rawChiefPhone) {
    if (!PHONE_ALLOWED_CHARACTERS_REGEX.test(rawChiefPhone)) {
      fieldErrors.chiefPhone = "Chief phone number is invalid.";
    } else {
      const phone = rawChiefPhone.replace(/[\s\-().]/g, "");

      if (!PHONE_NORMALIZED_REGEX.test(phone)) {
        fieldErrors.chiefPhone = "Chief phone number is invalid.";
      } else {
        chiefPhone = phone;
      }
    }
  }

  if (!rawChiefEmail && !rawChiefPhone) {
    fieldErrors.chiefIdentifier =
      "Provide at least one Chief login identifier: email or phone.";
  }

  if (rawChiefPassword.length < 8 || rawChiefPassword.length > 72) {
    fieldErrors.chiefPassword =
      "Chief password must be between 8 and 72 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
    };
  }

  return {
    ok: true,
    data: {
      villageCode,
      villageName,
      chiefName,
      chiefEmail,
      chiefPhone,
      chiefPassword: rawChiefPassword,
    },
  };
}
