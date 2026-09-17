"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { rejectKpayPaymentAction } from "../actions/reject-kpay-payment.action";

export function RejectPaymentForm({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await rejectKpayPaymentAction(formData);

      if (result.success) {
        router.push("/village/verify-kpay");
        router.refresh();
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setError(result.error ?? "Unable to reject payment.");
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input name="paymentId" type="hidden" value={paymentId} />

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="rejectionNote"
        >
          Rejection reason <span className="text-red-600">*</span>
        </label>
        <textarea
          aria-describedby="rejectionNote-error"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="rejectionNote"
          name="rejectionNote"
          placeholder="Explain why this payment is being rejected..."
          rows={3}
        />
        {fieldErrors.rejectionNote ? (
          <p className="text-xs text-red-600" id="rejectionNote-error">
            {fieldErrors.rejectionNote}
          </p>
        ) : null}
        <p className="text-xs text-slate-500">
          Minimum 5 characters. This reason will be visible to the villager.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        className="w-full rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-900 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Rejecting..." : "Reject Payment"}
      </button>
    </form>
  );
}
