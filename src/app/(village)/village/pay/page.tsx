import { DisputeStatus, PaymentStatus } from "@prisma/client";
import { EmptyState } from "@/components/ui/empty-state";
import { CurrentFundCard } from "../../../../features/kpay-payment/components/current-fund-card";
import { KpayPaymentForm } from "../../../../features/kpay-payment/components/kpay-payment-form";
import { PaymentHistoryList } from "../../../../features/kpay-payment/components/payment-history-list";
import { isBlockingPaymentStatus } from "../../../../features/kpay-payment/lib/kpay-payment-rules";
import { requireKpayPaymentAccess } from "../../../../features/kpay-payment/lib/kpay-payment-access";
import { getFundAmountPerHouse } from "../../../../features/fund-management/lib/fund-target";
import { prisma } from "../../../../lib/prisma";

export const metadata = {
  title: "Pay | Village Fund Collection System",
};

export default async function PayPage() {
  const { user, villageId, houseId, fund } = await requireKpayPaymentAccess();

  if (!fund) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">Pay</h1>
          <p className="mt-1 text-sm text-slate-600">
            Submit KPay payment for the current active fund.
          </p>
        </div>
        <EmptyState
          description="There is no active fund in your village right now. Please check back later or contact your village chief."
          title="No active fund available"
        />
      </div>
    );
  }

  const [
    perHouse,
    collectedResult,
    existingBlockingPayment,
    unresolvedDispute,
    paymentHistory,
  ] = await Promise.all([
    getFundAmountPerHouse(prisma, villageId, fund.targetAmount),
    prisma.payment.aggregate({
      where: {
        fundId: fund.id,
        villageId,
        status: PaymentStatus.ACCEPTED,
      },
      _sum: { amount: true },
    }),
    prisma.payment.findFirst({
      where: {
        fundId: fund.id,
        houseId,
        villageId,
        status: { in: [PaymentStatus.ACCEPTED, PaymentStatus.PENDING] },
      },
      select: { id: true, status: true },
    }),
    prisma.dispute.findFirst({
      where: {
        villageId,
        status: { in: [DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW] },
        payment: {
          fundId: fund.id,
          houseId,
          payerUserId: user.id,
        },
      },
      select: { id: true },
    }),
    prisma.payment.findMany({
      where: {
        payerUserId: user.id,
        villageId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        amount: true,
        status: true,
        paymentMethod: true,
        rejectionNote: true,
        createdAt: true,
        disputes: {
          where: {
            status: {
              in: [
                DisputeStatus.OPEN,
                DisputeStatus.UNDER_REVIEW,
                DisputeStatus.RESOLVED,
              ],
            },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            status: true,
          },
        },
      },
    }),
  ]);

  const collectedAmount = collectedResult._sum.amount ?? 0;

  const hasBlockingPayment =
    existingBlockingPayment !== null &&
    isBlockingPaymentStatus(existingBlockingPayment.status);

  const hasUnresolvedDispute = unresolvedDispute !== null;

  const mappedPaymentHistory = paymentHistory.map((payment) => ({
    id: payment.id,
    amount: payment.amount,
    status: payment.status,
    paymentMethod: payment.paymentMethod,
    rejectionNote: payment.rejectionNote,
    createdAt: payment.createdAt,
    activeDispute: payment.disputes.length > 0 ? payment.disputes[0] : null,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Pay</h1>
        <p className="mt-1 text-sm text-slate-600">
          Submit KPay payment for the current active fund.
        </p>
      </div>

      <CurrentFundCard
        amountPerHouse={perHouse.ok ? perHouse.amountPerHouse : null}
        collectedAmount={collectedAmount}
        fundName={fund.name}
        numberOfHouse={perHouse.ok ? perHouse.numberOfHouse : null}
        totalAmount={fund.targetAmount}
      />

      {hasBlockingPayment ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <h2 className="text-sm font-medium text-emerald-900">
            Payment already submitted
          </h2>
          <p className="mt-2 text-sm text-emerald-800">
            {existingBlockingPayment?.status === PaymentStatus.ACCEPTED
              ? "Your payment for this fund has been accepted. Thank you!"
              : "Your payment is pending verification by the Collector. Please wait for confirmation."}
          </p>
        </div>
      ) : hasUnresolvedDispute ? (
        /* blocked state while dispute is under review ── */
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <h2 className="text-sm font-medium text-amber-900">
            Payment under dispute review
          </h2>
          <p className="mt-2 text-sm text-amber-800">
            Your previous payment is currently under review. Please wait until
            the review is completed before submitting another payment.
          </p>
          <p className="mt-2 text-xs text-amber-700">
            Once the Chief resolves the dispute, you will be able to resubmit if
            needed.
          </p>
        </div>
      ) : (
        <KpayPaymentForm minimumAmount={perHouse.amountPerHouse} />
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">Payment history</h2>
        <div className="mt-3">
          <PaymentHistoryList payments={mappedPaymentHistory} />
        </div>
      </section>
    </div>
  );
}
