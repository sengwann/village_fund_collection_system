import Link from "next/link";
import { FundStatus } from "@prisma/client";
import { activateFundAction } from "../actions/activate-fund.action";
import { closeFundAction } from "../actions/close-fund.action";
import {
  canActivateFund,
  canCloseFund,
  canEditFund,
} from "../lib/fund-lifecycle";

export function FundLifecycleActions({
  fundId,
  status,
  hasOtherActiveFund,
}: {
  fundId: string;
  status: FundStatus;
  hasOtherActiveFund: boolean;
}) {
  if (status === FundStatus.CLOSED) {
    return (
      <p className="text-sm text-slate-600">
        This fund is closed. No lifecycle actions are available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {canEditFund(status) ? (
        <Link
          className="block w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          href={`/village/funds/${fundId}/edit`}
        >
          Edit fund
        </Link>
      ) : null}

      {canActivateFund(status) ? (
        <form action={activateFundAction} className="space-y-2">
          <input name="fundId" type="hidden" value={fundId} />
          <button
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={hasOtherActiveFund}
            type="submit"
          >
            Activate fund
          </button>
          {hasOtherActiveFund ? (
            <p className="text-xs text-amber-700">
              Another fund is already active. Close the active fund before
              activating this one.
            </p>
          ) : (
            <p className="text-xs text-slate-600">
              Only one fund can be active per village.
            </p>
          )}
        </form>
      ) : null}

      {canCloseFund(status) ? (
        <form action={closeFundAction} className="space-y-2">
          <input name="fundId" type="hidden" value={fundId} />
          <button
            className="w-full rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-900 transition hover:bg-red-100"
            type="submit"
          >
            Close fund
          </button>
          <p className="text-xs text-red-700">
            Closing preserves the fund and its payment history. Closed funds
            cannot be reopened in Module 14.
          </p>
        </form>
      ) : null}
    </div>
  );
}
