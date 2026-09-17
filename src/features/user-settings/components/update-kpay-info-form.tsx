"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import {
  updateKpayInfoAction,
  type UpdateKpayInfoActionResult,
} from "../actions/update-kpay-info.action";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function UpdateKpayInfoForm({
  initialKpayAccountName,
  initialKpayAccountNumber,
}: {
  initialKpayAccountName: string;
  initialKpayAccountNumber: string;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result: UpdateKpayInfoActionResult =
        await updateKpayInfoAction(formData);
      if (result.success) {
        setSuccessMessage("Payment information saved successfully.");
        router.refresh();
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to update payment information.");
    });
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="kpayAccountName"
        >
          KPay Account Name
        </label>
        <input
          aria-describedby="kpayAccountName-error"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          defaultValue={initialKpayAccountName}
          id="kpayAccountName"
          name="kpayAccountName"
          type="text"
        />
        <FieldError message={fieldErrors.kpayAccountName} />
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="kpayAccountNumber"
        >
          KPay Account Number
        </label>
        <input
          aria-describedby="kpayAccountNumber-error"
          autoComplete="tel"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          defaultValue={initialKpayAccountNumber}
          id="kpayAccountNumber"
          name="kpayAccountNumber"
          type="tel"
        />
        <FieldError message={fieldErrors.kpayAccountNumber} />
      </div>

      {formError ? (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          {successMessage}
        </p>
      ) : null}

      <button
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
