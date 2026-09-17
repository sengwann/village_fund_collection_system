"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import {
  recordCashPaymentAction,
  type RecordCashPaymentActionResult,
} from "../actions/record-cash-payment.action";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export interface HouseOption {
  id: string;
  houseNumber: string;
  members: { id: string; name: string }[];
}

export function CashPaymentForm({
  houses,
  minimumAmount,
}: {
  houses: HouseOption[];
  minimumAmount: number;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isPending, startTransition] = useTransition();
  const [selectedHouseId, setSelectedHouseId] = useState<string>("");

  const selectedHouse = houses.find((h) => h.id === selectedHouseId);
  const availableMembers = selectedHouse?.members ?? [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result: RecordCashPaymentActionResult =
        await recordCashPaymentAction(formData);

      if (result.success) {
        form.reset();
        setSelectedHouseId("");
        router.refresh();
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to record cash payment.");
    });
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Record cash payment
        </h2>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="houseId"
          >
            House
          </label>
          <select
            aria-describedby="houseId-error"
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            defaultValue=""
            id="houseId"
            name="houseId"
            onChange={(e) => setSelectedHouseId(e.target.value)}
          >
            <option disabled value="">
              Select a house
            </option>
            {houses.map((house) => (
              <option key={house.id} value={house.id}>
                House {house.houseNumber}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.houseId} />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="payerUserId"
          >
            Payer
          </label>
          <select
            aria-describedby="payerUserId-error"
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            defaultValue=""
            disabled={!selectedHouseId}
            id="payerUserId"
            name="payerUserId"
          >
            <option disabled value="">
              {selectedHouseId ? "Select a payer" : "Select a house first"}
            </option>
            {availableMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.payerUserId} />
          {selectedHouseId && availableMembers.length === 0 ? (
            <p className="text-xs text-amber-700">
              No eligible active members in this house.
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="amount"
          >
            Amount
          </label>
          <input
            aria-describedby="amount-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="amount"
            min={minimumAmount}
            name="amount"
            placeholder={`Minimum: ${minimumAmount.toLocaleString()}`}
            step={1}
            type="number"
          />
          <FieldError message={fieldErrors.amount} />
          <p className="text-xs text-slate-500">
            Must be at least {minimumAmount.toLocaleString()}. Overpayment is
            allowed.
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
        disabled={
          isPending || !selectedHouseId || availableMembers.length === 0
        }
        type="submit"
      >
        {isPending ? "Recording payment..." : "Record Cash Payment"}
      </button>
    </form>
  );
}
