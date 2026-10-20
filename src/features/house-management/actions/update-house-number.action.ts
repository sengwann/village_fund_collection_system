"use server";

import { notFound } from "next/navigation";
import { AuditActionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireChief } from "@/lib/authz";
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

  const rules = canEditHouseNumber();
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

  let outcome: "updated" | "unchanged" | "not_found";

  try {
    outcome = await prisma.$transaction(async (tx) => {
      // Scoped by village: a house from another village looks like "not found".
      const house = await tx.house.findFirst({
        where: { id: houseId, villageId },
        select: { id: true, houseNumber: true },
      });

      if (!house) return "not_found" as const;
      if (house.houseNumber === houseNumber) return "unchanged" as const;

      await tx.house.update({
        where: { id: house.id, villageId },
        data: { houseNumber },
      });

      await createAuditLog(tx, {
        actionType: AuditActionType.UPDATE,
        entityType: AuditEntityType.HOUSE,
        entityId: house.id,
        villageId,
        actorUserId: user.id,
        metadata: {
          houseNumber,
          previousHouseNumber: house.houseNumber,
        },
      });

      return "updated" as const;
    });
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

    // Row disappeared between the read and the write.
    if (prismaError.code === "P2025") {
      return notFound();
    }

    return {
      success: false,
      formError: "Unable to update house number. Please try again.",
    };
  }

  if (outcome === "not_found") return notFound();

  return { success: true };
}
