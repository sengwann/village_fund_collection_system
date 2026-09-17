"use server";

import {
  AuditActionType,
  MembershipStatus,
  UserRole,
  VillageStatus,
} from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { requireSystemAdmin } from "../../../lib/authz";
import { hashPassword } from "../../../lib/auth/password";
import {
  validateCreateVillageInput,
  type CreateVillageField,
} from "../lib/village-validators";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";
import { withSerializableRetry } from "../../../lib/db/transaction";

export type CreateVillageActionResult =
  | {
      success: true;
      villageId: string;
    }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<CreateVillageField, string>>;
    };

export async function createVillageAction(
  formData: FormData,
): Promise<CreateVillageActionResult> {
  const admin = await requireSystemAdmin();

  const validation = validateCreateVillageInput(formData);

  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }

  const {
    villageCode,
    villageName,
    chiefName,
    chiefEmail,
    chiefPhone,
    chiefPassword,
  } = validation.data;

  const passwordHash = await hashPassword(chiefPassword);

  try {
    const village = await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const newVillage = await tx.village.create({
            data: {
              villageCode,
              name: villageName,
              status: VillageStatus.ACTIVE,
            },
          });

          await tx.user.create({
            data: {
              name: chiefName,
              email: chiefEmail,
              phone: chiefPhone,
              passwordHash,
              role: UserRole.CHIEF,
              villageId: newVillage.id,
              houseId: null,
              membershipStatus: MembershipStatus.ACTIVE,
            },
          });

          await createAuditLog(tx, {
            actionType: AuditActionType.CREATE,
            entityType: AuditEntityType.VILLAGE,
            entityId: newVillage.id,
            villageId: newVillage.id,
            actorUserId: admin.id,
            metadata: {
              villageCode,
              name: villageName,
              newStatus: VillageStatus.ACTIVE,
            },
          });

          return newVillage;
        },
        {
          isolationLevel: "Serializable",
        },
      ),
    );

    return {
      success: true,
      villageId: village.id,
    };
  } catch (error) {
    const prismaError = error as {
      code?: string;
      meta?: {
        target?: unknown;
      };
    };

    if (prismaError.code === "P2002") {
      const targetInfo = JSON.stringify(prismaError.meta?.target ?? "");

      if (targetInfo.includes("villageCode")) {
        return {
          success: false,
          fieldErrors: {
            villageCode: "Village code already exists.",
          },
        };
      }

      if (targetInfo.includes("email")) {
        return {
          success: false,
          fieldErrors: {
            chiefEmail: "Chief email already exists.",
          },
        };
      }

      if (targetInfo.includes("phone")) {
        return {
          success: false,
          fieldErrors: {
            chiefPhone: "Chief phone already exists.",
          },
        };
      }

      return {
        success: false,
        formError:
          "A village or chief account with those details already exists.",
      };
    }

    return {
      success: false,
      formError: "Unable to create village. Please try again.",
    };
  }
}
