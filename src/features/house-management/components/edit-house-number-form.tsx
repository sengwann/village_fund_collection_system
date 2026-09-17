"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import {
  updateHouseNumberAction,
  type UpdateHouseActionResult,
} from "../actions/update-house-number.action";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function EditHouseNumberForm({
  houseId,
  currentHouseNumber,
}: {
  houseId: string;
  currentHouseNumber: string;
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
      const result: UpdateHouseActionResult = await updateHouseNumberAction(
        houseId,
        formData,
      );
      if (result.success) {
        router.push(`/village/houses/${houseId}`);
        router.refresh();
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to update house number.");
    });
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Edit house number
        </h2>
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
            defaultValue={currentHouseNumber}
            type="text"
            maxLength={30}
          />
          <FieldError message={fieldErrors.houseNumber} />
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
          onClick={() => router.push(`/village/houses/${houseId}`)}
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
