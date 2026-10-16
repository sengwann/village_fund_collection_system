import { notFound } from "next/navigation";
import { PaymentMethod } from "@prisma/client";
import { PaymentVerificationDetail } from "../../../../../features/kpay-verification/components/payment-verification-detail";
import { requireActiveCollector } from "../../../../../lib/authz";
import { prisma } from "../../../../../lib/prisma";

export const metadata = {
  title: "Payment Verification | Village Fund Collection System",
};

type RouteParams = Record<string, string | string[] | undefined>;

async function extractPaymentId(rawParams: unknown): Promise<string> {
  if (!rawParams) {
    return "";
  }
  let params: RouteParams;
  const maybePromise = rawParams as {
    then?: unknown;
  };
  if (typeof maybePromise.then === "function") {
    params = await (rawParams as Promise<RouteParams>);
  } else {
    params = rawParams as RouteParams;
  }
  const paymentId = params.paymentId;
  if (Array.isArray(paymentId)) {
    return paymentId[0] ?? "";
  }
  return paymentId ?? "";
}

export default async function PaymentVerificationPage({
  params,
}: {
  params: unknown;
}) {
  const { villageId } = await requireActiveCollector();

  const paymentId = await extractPaymentId(params);
  if (!paymentId) {
    notFound();
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: {
      id: true,
      villageId: true,
      amount: true,
      status: true,
      paymentMethod: true,
      kpayTransactionId: true,
      kpaySenderName: true,
      kpaySenderAccount: true,
      kpayReceiverAccount: true,
      rejectionNote: true,
      createdAt: true,
      fund: {
        select: {
          name: true,
          targetAmount: true,
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

  if (
    !payment ||
    payment.villageId !== villageId ||
    payment.paymentMethod !== PaymentMethod.KPAY
  ) {
    notFound();
  }

  return <PaymentVerificationDetail payment={payment} />;
}
