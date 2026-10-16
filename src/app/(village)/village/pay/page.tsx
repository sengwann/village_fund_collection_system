import { DisputeStatus, PaymentStatus } from "@prisma/client";
import {
  NoActiveFundView,
  PayPageView,
} from "../../../../features/kpay-payment/components/pay-page-view";
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
    return <NoActiveFundView />;
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
    <PayPageView
      amountPerHouse={perHouse.ok ? perHouse.amountPerHouse : null}
      blockingStatus={
        hasBlockingPayment && existingBlockingPayment
          ? existingBlockingPayment.status
          : null
      }
      collectedAmount={collectedAmount}
      fundName={fund.name}
      hasUnresolvedDispute={hasUnresolvedDispute}
      minimumAmount={perHouse.amountPerHouse}
      numberOfHouse={perHouse.ok ? perHouse.numberOfHouse : null}
      payments={mappedPaymentHistory}
      totalAmount={fund.targetAmount}
    />
  );
}
