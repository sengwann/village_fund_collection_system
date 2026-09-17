"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { submitRejoinRequestAction } from "../actions/submit-rejoin-request.action";

export function RejoinForm({
  houses,
}: {
  houses: {
    houseNumber: string;
  }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      await submitRejoinRequestAction(formData);
      router.refresh();
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <label
          className="block text-sm font-medium text-slate-900"
          htmlFor="houseNumber"
        >
          Select a house to rejoin
        </label>
        <select
          className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          defaultValue=""
          id="houseNumber"
          name="houseNumber"
          required
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
        <p className="text-xs text-slate-600">
          If the house already has active members, your request will be pending
          approval by the Head of House. If the house is empty, you will become
          the active Head of House.
        </p>
      </div>

      <button
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Submitting request..." : "Submit rejoin request"}
      </button>
    </form>
  );
}
