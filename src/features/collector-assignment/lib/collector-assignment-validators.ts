import "server-only";

export type AssignCollectorField = "userId" | "year" | "month";

export interface NormalizedAssignCollectorInput {
  userId: string;
  year: number;
  month: number;
}

export type AssignCollectorValidationResult =
  | {
      ok: true;
      data: NormalizedAssignCollectorInput;
    }
  | {
      ok: false;
      fieldErrors: Partial<Record<AssignCollectorField, string>>;
      formError?: string;
    };

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value;
  }
  return "";
}

export function validateAssignCollectorInput(
  formData: FormData,
  currentPeriod: { year: number; month: number },
): AssignCollectorValidationResult {
  const fieldErrors: Partial<Record<AssignCollectorField, string>> = {};

  const userId = getFormDataString(formData, "userId");
  const rawYear = getFormDataString(formData, "year");
  const rawMonth = getFormDataString(formData, "month");

  if (!userId) {
    fieldErrors.userId = "Select a village member to assign as Collector.";
  }

  const year = parseInt(rawYear, 10);
  const month = parseInt(rawMonth, 10);

  if (isNaN(year) || year < 2020 || year > 2100) {
    fieldErrors.year = "Select a valid year.";
  }

  if (isNaN(month) || month < 1 || month > 12) {
    fieldErrors.month = "Select a valid month.";
  }

  if (!fieldErrors.year && !fieldErrors.month) {
    const isPast =
      year < currentPeriod.year ||
      (year === currentPeriod.year && month < currentPeriod.month);

    if (isPast) {
      fieldErrors.month = "Cannot assign a collector for a past period.";
    }
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
      userId,
      year,
      month,
    },
  };
}
