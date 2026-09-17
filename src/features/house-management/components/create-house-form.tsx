"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import {
  createHouseAction,
  type CreateHouseActionResult,
} from "../actions/create-house.action";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function CreateHouseForm() {
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
      const result: CreateHouseActionResult = await createHouseAction(formData);
      if (result.success) {
        router.push(`/village/houses/${result.houseId}`);
        router.refresh();
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to create house.");
    });
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">House details</h2>
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="houseNumber"
          >
            House number
          </label>
          <input
            aria-describedby="houseNumber-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="houseNumber"
            name="houseNumber"
            placeholder="Example: A-12 or 101"
            type="text"
            maxLength={30}
          />
          <FieldError message={fieldErrors.houseNumber} />
          <p className="text-xs text-slate-500">
            Letters, numbers, spaces, hyphens, slashes, and dots are allowed.
            (2-30 characters)
          </p>
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
        {isPending ? "Creating house..." : "Create house"}
      </button>
    </form>
  );
}
