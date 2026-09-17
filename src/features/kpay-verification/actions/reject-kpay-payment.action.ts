"use server";
import { revalidateVillageShell } from "@/features/shell/lib/shell-revalidation";
import {
  AuditActionType,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import { withSerializableRetry } from "@/lib/db/transaction";
import { prisma } from "@/lib/prisma";
import { createAuditLog, AuditEntityType } from "@/lib/audit";
import { requireActiveCollector } from "@/lib/authz";
import { validateRejectionNote } from "../lib/kpay-verification-validators";

export type RejectKpayPaymentActionResult =
  | { success: true }
  | { success: false; error?: string; fieldErrors?: Record<string, string> };

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function rejectKpayPaymentAction(
  formData: FormData,
): Promise<RejectKpayPaymentActionResult> {
  const { user, villageId } = await requireActiveCollector();
  const paymentId = getFormDataString(formData, "paymentId");
  if (!paymentId) return { success: false, error: "Payment not found." };

  const rawNote = getFormDataString(formData, "rejectionNote");
  const noteValidation = validateRejectionNote(rawNote);
  if (!noteValidation.ok) {
    return {
      success: false,
      fieldErrors: { rejectionNote: noteValidation.error },
    };
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
    payment.paymentMethod !== PaymentMethod.KPAY
  ) {
    return { success: false, error: "Payment not found." };
  }
  if (payment.status !== PaymentStatus.PENDING) {
    return {
      success: false,
      error: "This payment has already been processed.",
    };
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

          await tx.payment.update({
            where: { id: paymentId },
            data: {
              status: PaymentStatus.REJECTED,
              rejectionNote: noteValidation.data,
              collectorUserId: user.id,
            },
          });

          await createAuditLog(tx, {
            actionType: AuditActionType.REJECT,
            entityType: AuditEntityType.PAYMENT,
            entityId: paymentId,
            villageId,
            actorUserId: user.id,
            metadata: {
              amount: payment.amount,
              paymentMethod: PaymentMethod.KPAY,
              fundId: payment.fundId,
              houseId: payment.houseId,
              rejectionNote: noteValidation.data,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ),
    );

    revalidateVillageShell();
    return { success: true };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PAYMENT_ALREADY_PROCESSED"
    ) {
      return {
        success: false,
        error: "This payment has already been processed.",
      };
    }
    return {
      success: false,
      error: "Unable to reject payment. Please try again.",
    };
  }
}
