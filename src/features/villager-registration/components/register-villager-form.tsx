"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import {
  registerVillagerAction,
  type RegisterVillagerActionResult,
} from "../actions/register-villager.action";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function RegisterVillagerForm({
  villageCode,
  villageName,
  houses,
}: {
  villageCode: string;
  villageName: string;
  houses: {
    houseNumber: string;
  }[];
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
      const result: RegisterVillagerActionResult =
        await registerVillagerAction(formData);

      if (result.success) {
        router.push(result.redirectTo);
        router.refresh();
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to register.");
    });
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <input name="villageCode" type="hidden" value={villageCode} />

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">Village</h2>
        <p className="mt-2 text-sm font-medium text-slate-900">{villageName}</p>
        <p className="mt-1 text-xs text-slate-600">
          Village code: {villageCode}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Village cannot be changed during registration.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">Account details</h2>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="name"
          >
            Name
          </label>
          <input
            aria-describedby="name-error"
            autoComplete="name"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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
            id="phone"
            name="phone"
            type="tel"
          />
          <FieldError message={fieldErrors.phone} />
        </div>

        <FieldError message={fieldErrors.identifier} />

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="password"
          >
            Password
          </label>
          <input
            aria-describedby="password-error"
            autoComplete="new-password"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="password"
            name="password"
            type="password"
          />
          <FieldError message={fieldErrors.password} />
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
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            max={new Date().toISOString().split("T")[0]}
          />
          <FieldError message={fieldErrors.dateOfBirth} />
          <p className="text-xs text-slate-500">
            Optional. You can add this later from Settings.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">House</h2>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="houseNumber"
          >
            House number
          </label>
          <select
            aria-describedby="houseNumber-error"
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            defaultValue=""
            id="houseNumber"
            name="houseNumber"
          >
            <option disabled value="">
              Select a house number
            </option>
            {houses.map((house) => (
              <option key={house.houseNumber} value={house.houseNumber}>
                {house.houseNumber}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.houseNumber} />
          <p className="text-xs text-slate-500">
            You can only join a house number created by the village chief.
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
        {isPending ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
