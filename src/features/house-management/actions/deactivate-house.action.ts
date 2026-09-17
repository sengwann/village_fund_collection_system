"use server";

import { redirect, notFound } from "next/navigation";
import { AuditActionType, MembershipStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireChief } from "@/lib/authz";
import { requireSameVillage } from "@/lib/authz/tenant";
import { canDeactivateHouse } from "../lib/house-rules";
import { AuditEntityType, createAuditLog } from "@/lib/audit";

export async function deactivateHouseAction(houseId: string): Promise<void> {
  const { user, villageId } = await requireChief();

  const house = await prisma.house.findUnique({
    where: { id: houseId },
    select: {
      id: true,
      villageId: true,
      houseNumber: true,
      isActive: true,
      members: {
        where: {
          membershipStatus: {
            in: [MembershipStatus.ACTIVE, MembershipStatus.PENDING],
          },
        },
        select: { id: true },
      },
      _count: {
        select: {
          payments: true,
        },
      },
    },
  });

  if (!house) return notFound();
  requireSameVillage({ user, villageId }, house.villageId);

  const rules = canDeactivateHouse({
    isActive: house.isActive,
    hasActiveOrPendingMembers: house.members.length > 0,
    hasPayments: house._count.payments > 0,
  });

  if (!rules.allowed) {
    redirect(`/village/houses/${houseId}`);
  }

  await prisma.house.update({
    where: { id: houseId },
    data: { isActive: false },
  });

  await createAuditLog(prisma, {
    actionType: AuditActionType.STATUS_CHANGE,
    entityType: AuditEntityType.HOUSE,
    entityId: houseId,
    villageId,
    actorUserId: user.id,
    metadata: {
      houseNumber: house.houseNumber,
      isActive: false,
    },
  });

  redirect(`/village/houses/${houseId}`);
}
