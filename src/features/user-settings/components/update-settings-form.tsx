"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import {
  updateSettingsAction,
  type UpdateSettingsActionResult,
} from "../actions/update-settings.action";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function UpdateSettingsForm({
  initialTheme,
  initialLanguage,
}: {
  initialTheme: string;
  initialLanguage: string;
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
      const result: UpdateSettingsActionResult =
        await updateSettingsAction(formData);
      if (result.success) {
        router.refresh();
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to update settings.");
    });
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <input name="theme" type="hidden" value={initialTheme} />

      {/* Language */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-900">Language</h3>
        <div className="space-y-2">
          {[
            { value: "EN", label: "English" },
            { value: "MY", label: "Myanmar (မြန်မာ)" },
          ].map((option) => (
            <label
              className="flex items-center gap-3 text-sm text-slate-700"
              key={option.value}
            >
              <input
                defaultChecked={initialLanguage === option.value}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                name="language"
                type="radio"
                value={option.value}
              />
              {option.label}
            </label>
          ))}
        </div>
        <FieldError message={fieldErrors.language} />
      </div>

      <FieldError message={fieldErrors.theme} />

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
        {isPending ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
