import { MembershipStatus, PaymentMethod } from "@prisma/client";
import { EmptyState } from "../../../../components/ui/empty-state";
import { CashPaymentForm } from "../../../../features/cash-payment/components/cash-payment-form";
import type { HouseOption } from "../../../../features/cash-payment/components/cash-payment-form";
import { CashPaymentList } from "../../../../features/cash-payment/components/cash-payment-list";
import { requireCashPaymentAccess } from "../../../../features/cash-payment/lib/cash-payment-access";
import { getFundAmountPerHouse } from "../../../../features/fund-management/lib/fund-target";
import { prisma } from "../../../../lib/prisma";

export const metadata = {
  title: "Cash Payments | Village Fund Collection System",
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en").format(amount);
}

export default async function CashPage() {
  const { villageId, fund } = await requireCashPaymentAccess();

  if (!fund) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            Cash Payments
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Record cash payments for the current active fund.
          </p>
        </div>
        <EmptyState
          description="There is no active fund in your village right now. Cash payment recording is unavailable."
          title="No active fund available"
        />
      </div>
    );
  }

  const perHouse = await getFundAmountPerHouse(
    prisma,
    villageId,
    fund.targetAmount,
  );

  const houses: HouseOption[] = await prisma.house.findMany({
    where: { villageId, isActive: true },
    orderBy: { houseNumber: "asc" },
    select: {
      id: true,
      houseNumber: true,
      members: {
        where: { membershipStatus: MembershipStatus.ACTIVE },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      },
    },
  });

  const recentPayments = await prisma.payment.findMany({
    where: { villageId, paymentMethod: PaymentMethod.CASH },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      amount: true,
      status: true,
      createdAt: true,
      voidReason: true,
      house: { select: { houseNumber: true } },
      payer: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Cash Payments</h1>
        <p className="mt-1 text-sm text-slate-600">
          Record cash payments for the current active fund. Cash payments are
          accepted immediately.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">Current Fund</h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Fund name</dt>
            <dd className="text-slate-900">{fund.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-slate-700">Total project amount</dt>
            <dd className="text-slate-900">
              {formatAmount(fund.targetAmount)}
            </dd>
          </div>
          {perHouse.ok ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Amount per house</dt>
              <dd className="text-slate-900">
                {formatAmount(perHouse.amountPerHouse)}
                <span className="ml-1 text-xs text-slate-500">
                  (total ÷ {perHouse.numberOfHouse} houses, rounded up)
                </span>
              </dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-3 text-xs text-slate-600">
          Cash payment amount must be at least the amount per house. Overpayment
          is allowed as an extra contribution.
        </p>
      </div>

      {perHouse.ok ? (
        <CashPaymentForm
          houses={houses}
          minimumAmount={perHouse.amountPerHouse}
        />
      ) : (
        <EmptyState
          description={perHouse.error}
          title="Unable to calculate payment amount"
        />
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Recent cash payments
        </h2>
        <div className="mt-3">
          <CashPaymentList payments={recentPayments} />
        </div>
      </section>
    </div>
  );
}
