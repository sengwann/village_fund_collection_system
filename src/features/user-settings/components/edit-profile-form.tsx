"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import {
  updateProfileAction,
  type UpdateProfileActionResult,
} from "../actions/update-profile.action";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function EditProfileForm({
  initialName,
  initialEmail,
  initialPhone,
  initialDateOfBirth,
}: {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
  initialDateOfBirth: string;
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
      const result: UpdateProfileActionResult =
        await updateProfileAction(formData);
      if (result.success) {
        router.refresh();
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to update profile.");
    });
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="name"
        >
          Name
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
          htmlFor="email"
        >
          Email
        </label>
        <input
          aria-describedby="email-error"
          autoComplete="email"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          defaultValue={initialEmail}
          id="email"
          name="email"
          type="email"
        />
        <FieldError message={fieldErrors.email} />
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="phone"
        >
          Phone
        </label>
        <input
          aria-describedby="phone-error"
          autoComplete="tel"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          defaultValue={initialPhone}
          id="phone"
          name="phone"
          type="tel"
        />
        <FieldError message={fieldErrors.phone} />
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="dateOfBirth"
        >
          Date of birth{" "}
          <span className="text-xs text-slate-500">(optional)</span>
        </label>
        <input
          aria-describedby="dateOfBirth-error"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          defaultValue={initialDateOfBirth}
          id="dateOfBirth"
          max={new Date().toISOString().split("T")[0]}
          name="dateOfBirth"
          type="date"
        />
        <FieldError message={fieldErrors.dateOfBirth} />
        <p className="text-xs text-slate-500">
          Used for village demographic statistics. You can leave this empty.
        </p>
      </div>

      <FieldError message={fieldErrors.identifier} />

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
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
