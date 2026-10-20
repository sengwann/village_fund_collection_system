"use server";

import { redirect, notFound } from "next/navigation";
import { AuditActionType, MembershipStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireChief } from "@/lib/authz";
import { canDeactivateHouse } from "../lib/house-rules";
import { AuditEntityType, createAuditLog } from "@/lib/audit";
import { withSerializableRetry } from "@/lib/db/transaction";

export async function deactivateHouseAction(houseId: string): Promise<void> {
  const { user, villageId } = await requireChief();

  // The id of the house when it was found in this village, otherwise null.
  // A blocked deactivation is not an error: the detail page shows why.
  let foundHouseId: string | null;

  try {
    foundHouseId = await withSerializableRetry(() =>
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
            },
          });

          if (!house || house.villageId !== villageId) {
            return null;
          }

          const rules = canDeactivateHouse({
            isActive: house.isActive,
            hasActiveOrPendingMembers: house.members.length > 0,
          });

          if (!rules.allowed) {
            return house.id;
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

          return house.id;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ),
    );
  } catch (error) {
    // P2025: the house changed (for example already deactivated) between the
    // read and the write. Show the current state instead of an error page.
    if ((error as { code?: string })?.code === "P2025") {
      return redirect(`/village/houses/${houseId}`);
    }
    throw error;
  }

  if (!foundHouseId) {
    return notFound();
  }

  redirect(`/village/houses/${foundHouseId}`);
}
