"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import {
  submitKpayPaymentAction,
  type SubmitKpayPaymentActionResult,
} from "../actions/submit-kpay-payment.action";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function KpayPaymentForm({ minimumAmount }: { minimumAmount: number }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result: SubmitKpayPaymentActionResult =
        await submitKpayPaymentAction(formData, minimumAmount);
      if (result.success) {
        router.push("/village/pay");
        router.refresh();
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to submit payment.");
    });
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">Payment amount</h2>
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="amount"
          >
            Amount
          </label>
          <input
            aria-describedby="amount-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="amount"
            min={minimumAmount}
            name="amount"
            placeholder={`Minimum: ${minimumAmount.toLocaleString()}`}
            step={1}
            type="number"
          />
          <FieldError message={fieldErrors.amount} />
          <p className="text-xs text-slate-500">
            Must be at least {minimumAmount.toLocaleString()} (your house&apos;s
            share). Overpayment is allowed.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          KPay transaction details
        </h2>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="kpayTransactionId"
          >
            KPay transaction ID
          </label>
          <input
            aria-describedby="kpayTransactionId-error"
            autoComplete="off"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="kpayTransactionId"
            maxLength={22}
            name="kpayTransactionId"
            placeholder="Example: KP466722098854...."
            type="text"
          />
          <FieldError message={fieldErrors.kpayTransactionId} />
          <p className="text-xs text-slate-500">
            Enter the full 18-22 character ID. Spaces/symbols are removed
            automatically.
          </p>
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="kpaySenderAccount"
          >
            Sender&apos;s KPay account
          </label>
          <input
            aria-describedby="kpaySenderAccount-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="kpaySenderAccount"
            name="kpaySenderAccount"
            type="text"
          />
          <FieldError message={fieldErrors.kpaySenderAccount} />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="kpaySenderName"
          >
            Sender&apos;s KPay name
          </label>
          <input
            aria-describedby="kpaySenderName-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="kpaySenderName"
            name="kpaySenderName"
            type="text"
          />
          <FieldError message={fieldErrors.kpaySenderName} />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="kpayReceiverAccount"
          >
            Receiver&apos;s KPay account
          </label>
          <input
            aria-describedby="kpayReceiverAccount-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="kpayReceiverAccount"
            name="kpayReceiverAccount"
            type="text"
          />
          <FieldError message={fieldErrors.kpayReceiverAccount} />
        </div>
      </div>

      {formError ? (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      ) : null}

      <button
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Submitting payment..." : "Submit KPay payment"}
      </button>
    </form>
  );
}
