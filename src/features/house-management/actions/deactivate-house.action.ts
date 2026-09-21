"use server";

import { redirect, notFound } from "next/navigation";
import { AuditActionType, MembershipStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireChief } from "@/lib/authz";
import { requireSameVillage } from "@/lib/authz/tenant";
import { canDeactivateHouse } from "../lib/house-rules";
import { AuditEntityType, createAuditLog } from "@/lib/audit";
import { withSerializableRetry } from "@/lib/db/transaction";

export async function deactivateHouseAction(houseId: string): Promise<void> {
  const { user, villageId } = await requireChief();

  const result = await withSerializableRetry(() =>
    prisma.$transaction(
      async (tx) => {
        const house = await tx.house.findUnique({
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
              select: { payments: true },
            },
          },
        });

        if (!house || house.villageId !== villageId) {
          return null;
        }

        const rules = canDeactivateHouse({
          isActive: house.isActive,
          hasActiveOrPendingMembers: house.members.length > 0,
          hasPayments: house._count.payments > 0,
        });

        if (!rules.allowed) {
          return { houseId: house.id, allowed: false as const };
        }

        await tx.house.update({
          where: {
            id: house.id,
            villageId,
            isActive: true,
          },
          data: { isActive: false },
        });

        await createAuditLog(tx, {
          actionType: AuditActionType.STATUS_CHANGE,
          entityType: AuditEntityType.HOUSE,
          entityId: house.id,
          villageId,
          actorUserId: user.id,
          metadata: {
            houseNumber: house.houseNumber,
            isActive: false,
          },
        });

        return { houseId: house.id, allowed: true as const };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    ),
  );

  if (!result) {
    return notFound();
  }

  if (!result.allowed) {
    return redirect(`/village/houses/${result.houseId}`);
  }

  redirect(`/village/houses/${result.houseId}`);
}
