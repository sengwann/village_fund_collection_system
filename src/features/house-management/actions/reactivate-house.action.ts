"use server";

import { redirect, notFound } from "next/navigation";
import { AuditActionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireChief } from "@/lib/authz";
import { requireSameVillage } from "@/lib/authz/tenant";
import { canReactivateHouse } from "../lib/house-rules";
import { AuditEntityType, createAuditLog } from "@/lib/audit";

export async function reactivateHouseAction(houseId: string): Promise<void> {
  const { user, villageId } = await requireChief();

  const house = await prisma.house.findUnique({
    where: { id: houseId },
    select: {
      id: true,
      villageId: true,
      houseNumber: true,
      isActive: true,
    },
  });

  if (!house) return notFound();
  requireSameVillage({ user, villageId }, house.villageId);

  const rules = canReactivateHouse({
    isActive: house.isActive,
    hasActiveOrPendingMembers: false,
    hasPayments: false,
  });

  if (!rules.allowed) {
    redirect(`/village/houses/${houseId}`);
  }

  await prisma.house.update({
    where: { id: houseId },
    data: { isActive: true },
  });

  await createAuditLog(prisma, {
    actionType: AuditActionType.STATUS_CHANGE,
    entityType: AuditEntityType.HOUSE,
    entityId: houseId,
    villageId,
    actorUserId: user.id,
    metadata: {
      houseNumber: house.houseNumber,
      isActive: true,
    },
  });

  redirect(`/village/houses/${houseId}`);
}
