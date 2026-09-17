"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import {
  changePasswordAction,
  type ChangePasswordActionResult,
} from "../actions/change-password.action";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function ChangePasswordForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result: ChangePasswordActionResult =
        await changePasswordAction(formData);
      if (result.success) {
        setSuccessMessage("Password changed successfully.");
        event.currentTarget.reset();
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to change password.");
    });
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="currentPassword"
        >
          Current password
        </label>
        <input
          aria-describedby="currentPassword-error"
          autoComplete="current-password"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="currentPassword"
          name="currentPassword"
          type="password"
        />
        <FieldError message={fieldErrors.currentPassword} />
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="newPassword"
        >
          New password
        </label>
        <input
          aria-describedby="newPassword-error"
          autoComplete="new-password"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="newPassword"
          name="newPassword"
          type="password"
        />
        <FieldError message={fieldErrors.newPassword} />
        <p className="text-xs text-slate-500">
          Must be between 8 and 72 characters.
        </p>
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="confirmPassword"
        >
          Confirm new password
        </label>
        <input
          aria-describedby="confirmPassword-error"
          autoComplete="new-password"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
        />
        <FieldError message={fieldErrors.confirmPassword} />
      </div>

      {formError ? (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          {successMessage}
        </p>
      ) : null}

      <button
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Changing password..." : "Change password"}
      </button>
    </form>
  );
}
