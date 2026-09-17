import Link from "next/link";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { EmptyState } from "../../../../components/ui/empty-state";
import { requireActiveCollector } from "../../../../lib/authz";
import { prisma } from "../../../../lib/prisma";

export const metadata = {
  title: "Verify KPay | Village Fund Collection System",
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en").format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function VerifyKpayPage() {
  const { villageId } = await requireActiveCollector();

  const pendingPayments = await prisma.payment.findMany({
    where: {
      villageId,
      paymentMethod: PaymentMethod.KPAY,
      status: PaymentStatus.PENDING,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      amount: true,
      createdAt: true,
      fund: {
        select: {
          name: true,
        },
      },
      house: {
        select: {
          houseNumber: true,
        },
      },
      payer: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">
          Verify KPay Payments
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Review and verify pending KPay payment submissions.
        </p>
      </div>

      {pendingPayments.length === 0 ? (
        <EmptyState
          description="There are no pending KPay payments to verify. Check back later."
          title="No pending payments"
        />
      ) : (
        <div className="space-y-3">
          {pendingPayments.map((payment) => (
            <Link
              className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
              href={`/village/verify-kpay/${payment.id}`}
              key={payment.id}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {payment.payer.name}
                  </p>
                  <p className="truncate text-xs text-slate-600">
                    House {payment.house.houseNumber} · {payment.fund.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {formatAmount(payment.amount)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                  PENDING
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
