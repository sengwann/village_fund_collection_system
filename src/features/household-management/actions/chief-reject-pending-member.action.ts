"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AuditActionType,
  MembershipStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { requireChief } from "../../../lib/authz/roles";
import { revalidateVillageShell } from "../../shell/lib/shell-revalidation";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";
import { canChiefRejectPendingMember } from "../lib/chief-membership-rules";

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value === "string") {
    return value;
  }

  return "";
}

/**
 * Chief rejects a pending member of a house that has no head.
 * Once the house has a head, only that head can reject pending members.
 */
export async function chiefRejectPendingMemberAction(
  formData: FormData,
): Promise<void> {
  const { user, villageId } = await requireChief();

  const houseId = getFormDataString(formData, "houseId");
  const memberId = getFormDataString(formData, "memberId");

  if (!houseId) {
    redirect("/village/houses");
  }

  const detailPath = `/village/houses/${houseId}`;

  if (!memberId) {
    redirect(detailPath);
  }

  // Village scoping: the house must belong to the Chief's own village.
  const house = await prisma.house.findFirst({
    where: {
      id: houseId,
      villageId,
    },
    select: {
      id: true,
      isActive: true,
      headOfHouseId: true,
    },
  });

  if (!house) {
    redirect("/village/houses");
  }

  const target = await prisma.user.findFirst({
    where: {
      id: memberId,
      houseId: house.id,
      villageId,
    },
    select: {
      id: true,
      role: true,
      membershipStatus: true,
    },
  });

  if (!target || !canChiefRejectPendingMember(target, house, user.id)) {
    redirect(detailPath);
  }

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          // Re-check inside the transaction that the house is still headless,
          // so the Chief cannot override a head who was approved meanwhile.
          const stillHeadless = await tx.house.count({
            where: {
              id: house.id,
              villageId,
              headOfHouseId: null,
            },
          });

          if (stillHeadless !== 1) {
            throw new Error("HOUSE_ALREADY_HAS_HEAD");
          }

          const updated = await tx.user.updateMany({
            where: {
              id: target.id,
              houseId: house.id,
              villageId,
              role: UserRole.VILLAGER,
              membershipStatus: MembershipStatus.PENDING,
            },
            data: {
              membershipStatus: MembershipStatus.REJECTED,
            },
          });

          if (updated.count !== 1) {
            throw new Error("INVALID_MEMBERSHIP_STATE");
          }

          await createAuditLog(tx, {
            actionType: AuditActionType.REJECT,
            entityType: AuditEntityType.USER,
            entityId: target.id,
            villageId,
            actorUserId: user.id,
            metadata: {
              previousMembershipStatus: MembershipStatus.PENDING,
              newMembershipStatus: MembershipStatus.REJECTED,
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
    redirect(detailPath);
  }

  revalidateVillageShell();
  revalidatePath(detailPath);

  redirect(detailPath);
}
