"use server";

import { revalidatePath } from "next/cache";
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

  // SECURITY 1: Only ACTIVE COLLECTORS may manage KPay info.
  // A plain VILLAGER or a CHIEF without an active assignment is rejected,
  // even if they call this action directly (bypassing the UI).
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
    // SECURITY 2: `user.id` comes from the authenticated session — never from
    // the client. A collector can therefore ONLY update their OWN record.
    // There is no userId field in the form, so cross-user edits are impossible.
    await prisma.user.update({
      where: { id: user.id },
      data: { kpayAccountName, kpayAccountNumber },
    });

    // Audit: do NOT store the sensitive account number in metadata
    // (same privacy pattern as change-password which logs only a note).
    await createAuditLog(prisma, {
      actionType: AuditActionType.UPDATE,
      entityType: AuditEntityType.USER,
      entityId: user.id,
      villageId: user.villageId ?? null,
      actorUserId: user.id,
      metadata: { note: "kpay_info_updated" },
    });
  } catch {
    return {
      success: false,
      formError: "Unable to update payment information. Please try again.",
    };
  }

  revalidatePath("/settings");
  return { success: true };
}
