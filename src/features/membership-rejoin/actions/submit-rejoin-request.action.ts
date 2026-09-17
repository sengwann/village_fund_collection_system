"use server";

import { redirect } from "next/navigation";
import { AuditActionType, MembershipStatus, Prisma } from "@prisma/client";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { prisma } from "../../../lib/prisma";
import { requireRejoinContext } from "../lib/rejoin-access";
import {
  getFormDataString,
  normalizeHouseNumber,
} from "../lib/rejoin-validators";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";
import { revalidateVillageShell } from "../../shell/lib/shell-revalidation";

export async function submitRejoinRequestAction(
  formData: FormData,
): Promise<void> {
  const { user, villageId, membershipStatus } = await requireRejoinContext();

  const rawHouseNumber = getFormDataString(formData, "houseNumber");
  const houseNumber = normalizeHouseNumber(rawHouseNumber);

  if (!houseNumber) {
    redirect("/rejoin");
  }

  const house = await prisma.house.findUnique({
    where: {
      villageId_houseNumber: {
        villageId,
        houseNumber,
      },
    },
    select: {
      id: true,
      villageId: true,
      isActive: true,
    },
  });

  if (!house || !house.isActive || house.villageId !== villageId) {
    redirect("/rejoin");
  }

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const currentUser = await tx.user.findUnique({
            where: {
              id: user.id,
            },
            select: {
              id: true,
              membershipStatus: true,
            },
          });

          if (
            !currentUser ||
            (currentUser.membershipStatus !== MembershipStatus.REJECTED &&
              currentUser.membershipStatus !== MembershipStatus.REMOVED)
          ) {
            throw new Error("INVALID_REJOIN_STATE");
          }

          const currentHouse = await tx.house.findUnique({
            where: {
              id: house.id,
            },
            select: {
              id: true,
              isActive: true,
              villageId: true,
            },
          });

          if (
            !currentHouse ||
            !currentHouse.isActive ||
            currentHouse.villageId !== villageId
          ) {
            throw new Error("HOUSE_NOT_AVAILABLE");
          }

          const activeMemberCount = await tx.user.count({
            where: {
              houseId: house.id,
              membershipStatus: MembershipStatus.ACTIVE,
            },
          });

          let newMembershipStatus: MembershipStatus;

          if (activeMemberCount === 0) {
            await tx.user.update({
              where: {
                id: user.id,
              },
              data: {
                houseId: house.id,
                membershipStatus: MembershipStatus.ACTIVE,
              },
            });

            await tx.house.update({
              where: {
                id: house.id,
              },
              data: {
                headOfHouseId: user.id,
              },
            });

            newMembershipStatus = MembershipStatus.ACTIVE;
          } else {
            await tx.user.update({
              where: {
                id: user.id,
              },
              data: {
                houseId: house.id,
                membershipStatus: MembershipStatus.PENDING,
              },
            });

            newMembershipStatus = MembershipStatus.PENDING;
          }

          await createAuditLog(tx, {
            actionType: AuditActionType.STATUS_CHANGE,
            entityType: AuditEntityType.USER,
            entityId: user.id,
            villageId,
            actorUserId: user.id,
            metadata: {
              previousMembershipStatus: currentUser.membershipStatus,
              newMembershipStatus,
              houseId: house.id,
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      ),
    );
  } catch {
    redirect("/rejoin");
  }

  revalidateVillageShell();

  redirect("/village/dashboard");
}
