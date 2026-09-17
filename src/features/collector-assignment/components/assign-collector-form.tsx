"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import {
  assignCollectorAction,
  type AssignCollectorActionResult,
} from "../actions/assign-collector.action";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function AssignCollectorForm({
  eligibleUsers,
  currentYear,
}: {
  eligibleUsers: {
    id: string;
    name: string;
  }[];
  currentYear: number;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isPending, startTransition] = useTransition();

  const yearOptions = [currentYear, currentYear + 1];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result: AssignCollectorActionResult =
        await assignCollectorAction(formData);

      if (result.success) {
        router.refresh();
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to assign collector.");
    });
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">Assign Collector</h2>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="userId"
          >
            Village member
          </label>
          <select
            aria-describedby="userId-error"
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            defaultValue=""
            id="userId"
            name="userId"
          >
            <option disabled value="">
              Select a member
            </option>
            {eligibleUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.userId} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-900"
              htmlFor="year"
            >
              Year
            </label>
            <select
              aria-describedby="year-error"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              id="year"
              name="year"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.year} />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-900"
              htmlFor="month"
            >
              Month
            </label>
            <select
              aria-describedby="month-error"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              id="month"
              name="month"
            >
              {MONTH_LABELS.map((label, index) => (
                <option key={label} value={index + 1}>
                  {label}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.month} />
          </div>
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
        {isPending ? "Assigning collector..." : "Assign Collector"}
      </button>
    </form>
  );
}
