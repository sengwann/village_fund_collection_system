"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import {
  validateVillageCodeAction,
  type ValidateVillageCodeActionResult,
} from "../actions/validate-village-code.action";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function VillageCodeForm() {
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
      const result: ValidateVillageCodeActionResult =
        await validateVillageCodeAction(formData);

      if (result.success) {
        router.push(result.redirectTo);
        router.refresh();
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Invalid village code.");
    });
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="villageCode"
        >
          Village code
        </label>
        <input
          aria-describedby="villageCode-error"
          autoComplete="off"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="villageCode"
          name="villageCode"
          placeholder="Example: DEV100"
          type="text"
        />
        <FieldError message={fieldErrors.villageCode} />
        <p className="text-xs text-slate-500">
          Enter the village code provided by your village chief.
        </p>
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
        {isPending ? "Checking village code..." : "Continue"}
      </button>
    </form>
  );
}
