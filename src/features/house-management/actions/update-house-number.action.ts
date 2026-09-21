"use server";

import { notFound } from "next/navigation";
import { AuditActionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireChief } from "@/lib/authz";
import { requireSameVillage } from "@/lib/authz/tenant";
import { validateHouseNumber, type HouseField } from "../lib/house-validators";
import { canEditHouseNumber } from "../lib/house-rules";
import { AuditEntityType, createAuditLog } from "@/lib/audit";

export type UpdateHouseActionResult =
  | { success: true }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<HouseField, string>>;
    };

export async function updateHouseNumberAction(
  houseId: string,
  formData: FormData,
): Promise<UpdateHouseActionResult> {
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
          membershipStatus: { in: ["ACTIVE", "PENDING"] },
        },
        select: { id: true },
      },
      _count: {
        select: { payments: true },
      },
    },
  });

  if (!house) return notFound();
  requireSameVillage({ user, villageId }, house.villageId);

  const rules = canEditHouseNumber({
    isActive: house.isActive,
    hasActiveOrPendingMembers: house.members.length > 0,
    hasPayments: house._count.payments > 0,
  });

  if (!rules.allowed) {
    return { success: false, formError: rules.reason };
  }

  const rawHouseNumber = formData.get("houseNumber");
  const validation = validateHouseNumber(
    typeof rawHouseNumber === "string" ? rawHouseNumber : "",
  );

  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }

  const { houseNumber } = validation.data;

  if (houseNumber === house.houseNumber) {
    return { success: true };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.house.update({
        where: { id: houseId },
        data: { houseNumber },
      });

      await createAuditLog(tx, {
        actionType: AuditActionType.UPDATE,
        entityType: AuditEntityType.HOUSE,
        entityId: houseId,
        villageId,
        actorUserId: user.id,
        metadata: {
          houseNumber,
          previousHouseNumber: house.houseNumber,
        },
      });
    });

    return { success: true };
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      return {
        success: false,
        fieldErrors: {
          houseNumber: "House number already exists in this village.",
        },
      };
    }
    return {
      success: false,
      formError: "Unable to update house number. Please try again.",
    };
  }
}
