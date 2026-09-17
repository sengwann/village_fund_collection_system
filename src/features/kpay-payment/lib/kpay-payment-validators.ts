import "server-only";

const KPAY_TRANSACTION_ID_REGEX = /^[A-Z0-9]{18,22}$/;
const MAX_AMOUNT = 1_000_000_000;

export type KpayPaymentField =
  | "amount"
  | "kpayTransactionId"
  | "kpaySenderAccount"
  | "kpaySenderName"
  | "kpayReceiverAccount";

export interface NormalizedKpayPaymentInput {
  amount: number;
  kpayTransactionId: string;
  kpaySenderAccount: string;
  kpaySenderName: string;
  kpayReceiverAccount: string;
}

export type KpayPaymentValidationResult =
  | { ok: true; data: NormalizedKpayPaymentInput }
  | {
      ok: false;
      fieldErrors: Partial<Record<KpayPaymentField, string>>;
      formError?: string;
    };

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value;
  }
  return "";
}

export function sanitizeKpayTransactionId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function validateKpayPaymentInput(
  formData: FormData,
  minimumAmount: number,
): KpayPaymentValidationResult {
  const fieldErrors: Partial<Record<KpayPaymentField, string>> = {};

  const rawAmount = getFormDataString(formData, "amount").trim();
  const rawTransactionId = getFormDataString(formData, "kpayTransactionId");
  const rawSenderAccount = getFormDataString(
    formData,
    "kpaySenderAccount",
  ).trim();
  const rawSenderName = getFormDataString(formData, "kpaySenderName").trim();
  const rawReceiverAccount = getFormDataString(
    formData,
    "kpayReceiverAccount",
  ).trim();

  let amount = 0;
  if (!/^\d{1,10}$/.test(rawAmount)) {
    fieldErrors.amount = "Amount must be a positive integer.";
  } else {
    amount = Number(rawAmount);
    if (amount <= 0 || amount > MAX_AMOUNT) {
      fieldErrors.amount = `Amount must be between 1 and ${MAX_AMOUNT.toLocaleString()}.`;
    } else if (amount < minimumAmount) {
      fieldErrors.amount = `Amount must be at least ${minimumAmount.toLocaleString()}. Partial payment is not allowed.`;
    }
  }

  const kpayTransactionId = sanitizeKpayTransactionId(rawTransactionId);
  if (!KPAY_TRANSACTION_ID_REGEX.test(kpayTransactionId)) {
    fieldErrors.kpayTransactionId =
      "KPay transaction ID must be 18 to 22 characters using letters and numbers only.";
  }

  if (rawSenderAccount.length < 2 || rawSenderAccount.length > 100) {
    fieldErrors.kpaySenderAccount =
      "Sender's KPay account must be between 2 and 100 characters.";
  }

  if (rawSenderName.length < 2 || rawSenderName.length > 100) {
    fieldErrors.kpaySenderName =
      "Sender's KPay name must be between 2 and 100 characters.";
  }

  if (rawReceiverAccount.length < 2 || rawReceiverAccount.length > 100) {
    fieldErrors.kpayReceiverAccount =
      "Receiver's KPay account must be between 2 and 100 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    data: {
      amount,
      kpayTransactionId,
      kpaySenderAccount: rawSenderAccount,
      kpaySenderName: rawSenderName,
      kpayReceiverAccount: rawReceiverAccount,
    },
  };
}
