"use server";

import { redirect } from "next/navigation";
import { AuditActionType, MembershipStatus } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { requireHouseholdManagementAccess } from "../lib/household-access";
import { canRemoveActiveMember } from "../lib/membership-rules";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value;
  }
  return "";
}

export async function removeMemberAction(formData: FormData): Promise<void> {
  const { user, house } = await requireHouseholdManagementAccess();

  const memberId = getFormDataString(formData, "memberId");
  if (!memberId) {
    redirect("/village/household");
  }

  const target = await prisma.user.findFirst({
    where: {
      id: memberId,
      houseId: house.id,
      villageId: house.villageId,
    },
    select: {
      id: true,
      membershipStatus: true,
    },
  });

  if (!target || !canRemoveActiveMember(target, house, user.id)) {
    redirect("/village/household");
  }

  const updated = await prisma.user.updateMany({
    where: {
      id: target.id,
      houseId: house.id,
      villageId: house.villageId,
      membershipStatus: MembershipStatus.ACTIVE,
    },
    data: {
      membershipStatus: MembershipStatus.REMOVED,
    },
  });

  if (updated.count !== 1) {
    redirect("/village/household");
  }

  await createAuditLog(prisma, {
    actionType: AuditActionType.REMOVE,
    entityType: AuditEntityType.USER,
    entityId: target.id,
    villageId: house.villageId,
    actorUserId: user.id,
    metadata: {
      previousMembershipStatus: MembershipStatus.ACTIVE,
      newMembershipStatus: MembershipStatus.REMOVED,
      houseId: house.id,
    },
  });

  redirect("/village/household");
}
