import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { VerifyKpayQueue } from "../../../../features/kpay-verification/components/verify-kpay-queue";
import { requireActiveCollector } from "../../../../lib/authz";
import { prisma } from "../../../../lib/prisma";

export const metadata = {
  title: "Verify KPay | Village Fund Collection System",
};

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

  return <VerifyKpayQueue payments={pendingPayments} />;
}
