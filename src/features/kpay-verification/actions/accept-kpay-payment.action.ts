"use server";
import { redirect } from "next/navigation";
import { revalidateVillageShell } from "@/features/shell/lib/shell-revalidation";
import { PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";
import { withSerializableRetry } from "@/lib/db/transaction";
import { prisma } from "@/lib/prisma";
import { requireActiveCollector } from "@/lib/authz";
import { acceptPaymentInTransaction } from "../lib/accept-payment-service";

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function acceptKpayPaymentAction(
  formData: FormData,
): Promise<void> {
  const { user, villageId } = await requireActiveCollector();
  const paymentId = getFormDataString(formData, "paymentId");
  if (!paymentId) {
    redirect("/village/verify-kpay");
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: {
      id: true,
      villageId: true,
      status: true,
      paymentMethod: true,
      amount: true,
      fundId: true,
      houseId: true,
    },
  });

  if (
    !payment ||
    payment.villageId !== villageId ||
    payment.paymentMethod !== PaymentMethod.KPAY ||
    payment.status !== PaymentStatus.PENDING
  ) {
    redirect("/village/verify-kpay");
  }

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const currentPayment = await tx.payment.findUnique({
            where: { id: paymentId },
            select: { id: true, status: true, villageId: true },
          });

          if (
            !currentPayment ||
            currentPayment.villageId !== villageId ||
            currentPayment.status !== PaymentStatus.PENDING
          ) {
            throw new Error("PAYMENT_ALREADY_PROCESSED");
          }

          await acceptPaymentInTransaction(tx, {
            paymentId: payment.id,
            villageId,
            actorUserId: user.id,
            collectorUserId: user.id,
            fundId: payment.fundId,
            houseId: payment.houseId,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ),
    );
  } catch {
    redirect(`/village/verify-kpay/${paymentId}`);
  }

  revalidateVillageShell();
  redirect("/village/verify-kpay");
}
