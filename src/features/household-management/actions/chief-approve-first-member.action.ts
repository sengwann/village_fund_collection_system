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
import { canChiefApproveFirstMember } from "../lib/chief-membership-rules";

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value === "string") {
    return value;
  }

  return "";
}

/**
 * Chief approves one pending member of a house that has no head.
 * The member becomes ACTIVE and Head of House in a single transaction.
 * Remaining pending members stay PENDING and move to the new head's queue.
 */
export async function chiefApproveFirstMemberAction(
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

  if (!target || !canChiefApproveFirstMember(target, house, user.id)) {
    redirect(detailPath);
  }

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          // Claim the head slot only if the house still has no head. A plain
          // update could silently overwrite a head assigned a moment ago.
          const claimed = await tx.house.updateMany({
            where: {
              id: house.id,
              villageId,
              isActive: true,
              headOfHouseId: null,
            },
            data: {
              headOfHouseId: target.id,
            },
          });

          if (claimed.count !== 1) {
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
              membershipStatus: MembershipStatus.ACTIVE,
            },
          });

          if (updated.count !== 1) {
            throw new Error("INVALID_MEMBERSHIP_STATE");
          }

          await createAuditLog(tx, {
            actionType: AuditActionType.APPROVE,
            entityType: AuditEntityType.USER,
            entityId: target.id,
            villageId,
            actorUserId: user.id,
            metadata: {
              previousMembershipStatus: MembershipStatus.PENDING,
              newMembershipStatus: MembershipStatus.ACTIVE,
              houseId: house.id,
              assignedHeadOfHouse: true,
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      ),
    );
  } catch {
    // Lost a race (another head was set) or the member's state changed.
    // The transaction rolled back, so nothing was written.
    redirect(detailPath);
  }

  revalidateVillageShell();
  revalidatePath(detailPath);
  revalidatePath("/village/household");

  redirect(detailPath);
}
