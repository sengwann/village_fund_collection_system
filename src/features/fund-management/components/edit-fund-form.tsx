"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import {
  updateFundAction,
  type UpdateFundActionResult,
} from "../actions/update-fund.action";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function EditFundForm({
  fundId,
  initialName,
  initialDescription,
  initialTargetAmount,
  initialStartDate,
  initialEndDate,
}: {
  fundId: string;
  initialName: string;
  initialDescription: string;
  initialTargetAmount: string;
  initialStartDate: string;
  initialEndDate: string;
}) {
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
      const result: UpdateFundActionResult = await updateFundAction(formData);

      if (result.success) {
        router.push(`/village/funds/${fundId}`);
        router.refresh();
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to update fund.");
    });
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <input name="fundId" type="hidden" value={fundId} />

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">Edit fund</h2>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="name"
          >
            Fund name
          </label>
          <input
            aria-describedby="name-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            defaultValue={initialName}
            id="name"
            name="name"
            type="text"
          />
          <FieldError message={fieldErrors.name} />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            aria-describedby="description-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            defaultValue={initialDescription}
            id="description"
            name="description"
            rows={3}
          />
          <FieldError message={fieldErrors.description} />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="targetAmount"
          >
            Target amount
          </label>
          <input
            aria-describedby="targetAmount-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            defaultValue={initialTargetAmount}
            id="targetAmount"
            min={1}
            name="targetAmount"
            step={1}
            type="number"
          />
          <FieldError message={fieldErrors.targetAmount} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-900"
              htmlFor="startDate"
            >
              Start date
            </label>
            <input
              aria-describedby="startDate-error"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              defaultValue={initialStartDate}
              id="startDate"
              name="startDate"
              type="date"
            />
            <FieldError message={fieldErrors.startDate} />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-900"
              htmlFor="endDate"
            >
              End date
            </label>
            <input
              aria-describedby="endDate-error"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              defaultValue={initialEndDate}
              id="endDate"
              name="endDate"
              type="date"
            />
            <FieldError message={fieldErrors.endDate} />
          </div>
        </div>
      </div>

      {formError ? (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          disabled={isPending}
          type="button"
          onClick={() => router.push(`/village/funds/${fundId}`)}
        >
          Cancel
        </button>
        <button
          className="flex-1 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
