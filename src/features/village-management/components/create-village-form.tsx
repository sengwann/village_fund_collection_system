"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";

import {
  createVillageAction,
  type CreateVillageActionResult,
} from "../actions/create-village.action";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function CreateVillageForm() {
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
      const result: CreateVillageActionResult =
        await createVillageAction(formData);

      if (result.success) {
        router.push(`/admin/villages/${result.villageId}`);
        router.refresh();
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to create village.");
    });
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">Village details</h2>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="villageCode"
          >
            Village code
          </label>

          <input
            aria-describedby="villageCode-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="villageCode"
            name="villageCode"
            placeholder="Example: DEV101"
            type="text"
          />

          <FieldError message={fieldErrors.villageCode} />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="villageName"
          >
            Village name
          </label>

          <input
            aria-describedby="villageName-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="villageName"
            name="villageName"
            placeholder="Example: New Development Village"
            type="text"
          />

          <FieldError message={fieldErrors.villageName} />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Initial Chief account
        </h2>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="chiefName"
          >
            Chief name
          </label>

          <input
            aria-describedby="chiefName-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="chiefName"
            name="chiefName"
            type="text"
          />

          <FieldError message={fieldErrors.chiefName} />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="chiefEmail"
          >
            Chief email
          </label>

          <input
            aria-describedby="chiefEmail-error"
            autoComplete="email"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="chiefEmail"
            name="chiefEmail"
            type="email"
          />

          <FieldError message={fieldErrors.chiefEmail} />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="chiefPhone"
          >
            Chief phone
          </label>

          <input
            aria-describedby="chiefPhone-error"
            autoComplete="tel"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="chiefPhone"
            name="chiefPhone"
            type="tel"
          />

          <FieldError message={fieldErrors.chiefPhone} />
        </div>

        <FieldError message={fieldErrors.chiefIdentifier} />

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="chiefPassword"
          >
            Chief temporary password
          </label>

          <input
            aria-describedby="chiefPassword-error"
            autoComplete="new-password"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="chiefPassword"
            name="chiefPassword"
            type="password"
          />

          <FieldError message={fieldErrors.chiefPassword} />
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
        {isPending ? "Creating village..." : "Create village"}
      </button>
    </form>
  );
}
