"use server";

import { AuditActionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { getActiveCollectorContext } from "@/lib/authz";
import { AuditEntityType, createAuditLog } from "@/lib/audit";
import {
  validateKpayInfoInput,
  type KpayInfoField,
} from "../lib/settings-validators";

export type UpdateKpayInfoActionResult =
  | { success: true }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<KpayInfoField, string>>;
    };

export async function updateKpayInfoAction(
  formData: FormData,
): Promise<UpdateKpayInfoActionResult> {
  const user = await requireAuthenticatedUser();
  const collectorContext = await getActiveCollectorContext(user);
  if (!collectorContext) {
    return {
      success: false,
      formError: "Only active collectors can update payment information.",
    };
  }

  const validation = validateKpayInfoInput(formData);
  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }

  const { kpayAccountName, kpayAccountNumber } = validation.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { kpayAccountName, kpayAccountNumber },
      });

      await createAuditLog(tx, {
        actionType: AuditActionType.UPDATE,
        entityType: AuditEntityType.USER,
        entityId: user.id,
        villageId: user.villageId ?? null,
        actorUserId: user.id,
        metadata: { note: "kpay_info_updated" },
      });
    });
  } catch {
    return {
      success: false,
      formError: "Unable to update payment information. Please try again.",
    };
  }

  return { success: true };
}
