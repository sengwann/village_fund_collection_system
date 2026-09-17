"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";

import { loginAction } from "../actions/login.action";

export function LoginForm() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(result.redirectTo);
      router.refresh();
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="identifier"
        >
          Email or phone
        </label>

        <input
          autoComplete="username"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="identifier"
          name="identifier"
          placeholder="you@example.com or 09xxxxxxx"
          required
          type="text"
        />
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="password"
        >
          Password
        </label>

        <input
          autoComplete="current-password"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
