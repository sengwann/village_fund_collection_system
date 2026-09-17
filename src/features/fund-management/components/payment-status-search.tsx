"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { EmptyState } from "../../../components/ui/empty-state";
import {
  searchPaymentStatusAction,
  type PaymentStatusSearchItem,
} from "../actions/search-payment-status.action";

export function PaymentStatusSearchSection({ fundId }: { fundId: string }) {
  const [results, setResults] = useState<PaymentStatusSearchItem[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("fundId", fundId);

    startTransition(async () => {
      const result = await searchPaymentStatusAction(formData);
      if (result.ok) {
        setResults(result.results);
      } else {
        setResults(null);
        setError(result.error);
      }
    });
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-medium text-slate-900">
        Payment status search
      </h2>
      <p className="mt-1 text-xs text-slate-600">
        Search by house number or head of house name to check whether a house
        has paid for the current fund.
      </p>
      <form
        className="mt-3 flex flex-col gap-3 sm:flex-row"
        noValidate
        onSubmit={handleSubmit}
      >
        <input
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          name="q"
          placeholder="House number or head of house name"
          type="text"
        />
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Searching..." : "Search"}
        </button>
      </form>

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {results !== null && results.length === 0 ? (
        <EmptyState
          className="mt-3"
          description="No houses match your search."
          title="No matches"
        />
      ) : null}

      {results !== null && results.length > 0 ? (
        <div className="mt-3 space-y-3">
          {results.map((result) => (
            <div
              className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3"
              key={result.id}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  House {result.houseNumber}
                </p>
                <p className="truncate text-xs text-slate-600">
                  {result.headName ?? "No head of house"}
                </p>
              </div>
              {result.paid ? (
                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                  Paid
                </span>
              ) : (
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  Not paid
                </span>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
