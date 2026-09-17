"use server";

import { revalidateVillageShell } from "@/features/shell/lib/shell-revalidation";
import {
  AuditActionType,
  DisputeStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import { withSerializableRetry } from "@/lib/db/transaction";
import { prisma } from "@/lib/prisma";
import { createAuditLog, AuditEntityType } from "@/lib/audit";
import { requireCreateDisputeAccess } from "../lib/dispute-access";
import { validateDisputeDescription } from "../lib/dispute-validators";

export type CreateDisputeActionResult =
  | { success: true }
  | { success: false; error?: string; fieldErrors?: Record<string, string> };

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function createDisputeAction(
  formData: FormData,
): Promise<CreateDisputeActionResult> {
  const { user, villageId } = await requireCreateDisputeAccess();
  const paymentId = getStr(formData, "paymentId");
  if (!paymentId) return { success: false, error: "Payment not found." };

  const descValidation = validateDisputeDescription(
    getStr(formData, "description"),
  );
  if (!descValidation.ok) {
    return {
      success: false,
      fieldErrors: { description: descValidation.error },
    };
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: {
      id: true,
      villageId: true,
      status: true,
      payerUserId: true,
      paymentMethod: true,
    },
  });

  if (!payment || payment.villageId !== villageId)
    return { success: false, error: "Payment not found." };
  if (payment.payerUserId !== user.id)
    return { success: false, error: "You can only dispute your own payments." };
  if (payment.status !== PaymentStatus.REJECTED)
    return { success: false, error: "Only rejected payments can be disputed." };
  if (payment.paymentMethod !== PaymentMethod.KPAY)
    return { success: false, error: "Only KPay payments can be disputed." };

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const activeDispute = await tx.dispute.findFirst({
            where: {
              paymentId,
              villageId,
              status: {
                in: [
                  DisputeStatus.OPEN,
                  DisputeStatus.UNDER_REVIEW,
                  DisputeStatus.RESOLVED,
                ],
              },
            },
            select: { id: true },
          });
          if (activeDispute) {
            throw new Error("DUPLICATE_DISPUTE");
          }

          const dispute = await tx.dispute.create({
            data: {
              villageId,
              paymentId,
              raisedByUserId: user.id,
              status: DisputeStatus.OPEN,
              description: descValidation.data,
            },
          });

          await createAuditLog(tx, {
            actionType: AuditActionType.CREATE,
            entityType: AuditEntityType.DISPUTE,
            entityId: dispute.id,
            villageId,
            actorUserId: user.id,
            metadata: { paymentId },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ),
    );
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_DISPUTE") {
      return {
        success: false,
        error:
          "This payment already has an active or resolved dispute. You cannot raise another dispute.",
      };
    }
    return {
      success: false,
      error: "Unable to create dispute. Please try again.",
    };
  }

  revalidateVillageShell();
  return { success: true };
}
