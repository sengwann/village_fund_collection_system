"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition, FormEvent } from "react";
import { createDisputeAction } from "../actions/create-dispute.action";

export function CreateDisputeForm({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createDisputeAction(formData);
      if (result.success) {
        router.push("/village/disputes");
        router.refresh();
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setError(result.error ?? "Unable to create dispute.");
      }
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input name="paymentId" type="hidden" value={paymentId} />
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-900"
        >
          Why was this payment incorrectly rejected?{" "}
          <span className="text-red-600">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          placeholder="Explain your side. The Chief will review this alongside the KPay transaction details automatically."
        />
        {fieldErrors.description && (
          <p className="text-xs text-red-600">{fieldErrors.description}</p>
        )}
        <p className="text-xs text-slate-500">Minimum 10 characters.</p>
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {isPending ? "Submitting..." : "Submit Dispute"}
      </button>
    </form>
  );
}
