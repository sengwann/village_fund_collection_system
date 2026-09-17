"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { voidPaymentAction } from "../actions/void-payment.action";

export function VoidPaymentForm({ paymentId }: { paymentId: string }) {
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
      const result = await voidPaymentAction(formData);

      if (result.success) {
        router.push("/village/cash");
        router.refresh();
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setError(result.error ?? "Unable to void payment.");
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input name="paymentId" type="hidden" value={paymentId} />

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="voidReason"
        >
          Void reason <span className="text-red-600">*</span>
        </label>
        <textarea
          aria-describedby="voidReason-error"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="voidReason"
          name="voidReason"
          placeholder="Explain why this payment is being voided..."
          rows={3}
        />
        {fieldErrors.voidReason ? (
          <p className="text-xs text-red-600" id="voidReason-error">
            {fieldErrors.voidReason}
          </p>
        ) : null}
        <p className="text-xs text-slate-500">
          Minimum 5 characters. The original payment and receipt will be marked
          as VOIDED but preserved as historical records.
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
        {isPending ? "Voiding payment..." : "Void Payment"}
      </button>
    </form>
  );
}
