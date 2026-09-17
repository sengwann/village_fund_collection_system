"use server";

import { AuditActionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireChief } from "@/lib/authz";
import { validateHouseNumber, type HouseField } from "../lib/house-validators";
import { AuditEntityType, createAuditLog } from "@/lib/audit";

export type CreateHouseActionResult =
  | { success: true; houseId: string }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<HouseField, string>>;
    };

export async function createHouseAction(
  formData: FormData,
): Promise<CreateHouseActionResult> {
  const { user, villageId } = await requireChief();

  const rawHouseNumber = formData.get("houseNumber") as string;
  const validation = validateHouseNumber(rawHouseNumber);

  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }

  const { houseNumber } = validation.data;

  try {
    const house = await prisma.house.create({
      data: {
        villageId,
        houseNumber,
        isActive: true,
      },
    });

    await createAuditLog(prisma, {
      actionType: AuditActionType.CREATE,
      entityType: AuditEntityType.HOUSE,
      entityId: house.id,
      villageId,
      actorUserId: user.id,
      metadata: {
        houseNumber,
        isActive: true,
      },
    });

    return { success: true, houseId: house.id };
  } catch (error) {
    const prismaError = error as { code?: string; meta?: { target?: unknown } };
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
      formError: "Unable to create house. Please try again.",
    };
  }
}
