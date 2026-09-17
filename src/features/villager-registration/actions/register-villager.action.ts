"use server";

import {
  AuditActionType,
  MembershipStatus,
  Prisma,
  UserRole,
  VillageStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { withSerializableRetry } from "@/lib/db/transaction";
import { hashPassword } from "@/lib/auth/password";
import { revalidateVillageShell } from "../../shell/lib/shell-revalidation";
import {
  validateRegisterInput,
  type RegisterField,
} from "../lib/registration-validators";
import { AuditEntityType, createAuditLog } from "@/lib/audit";

export type RegisterVillagerActionResult =
  | {
      success: true;
      redirectTo: string;
    }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<RegisterField, string>>;
    };

class RegistrationInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistrationInputError";
  }
}

export async function registerVillagerAction(
  formData: FormData,
): Promise<RegisterVillagerActionResult> {
  const validation = validateRegisterInput(formData);
  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }

  const {
    villageCode,
    name,
    email,
    phone,
    password,
    houseNumber,
    dateOfBirth,
  } = validation.data;

  const passwordHash = await hashPassword(password);

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const village = await tx.village.findUnique({
            where: {
              villageCode,
            },
            select: {
              id: true,
              status: true,
            },
          });

          if (!village || village.status !== VillageStatus.ACTIVE) {
            throw new RegistrationInputError("Invalid village code.");
          }

          const house = await tx.house.findUnique({
            where: {
              villageId_houseNumber: {
                villageId: village.id,
                houseNumber,
              },
            },
            select: {
              id: true,
              isActive: true,
            },
          });

          if (!house || !house.isActive) {
            throw new RegistrationInputError(
              "Selected house is not available.",
            );
          }

          const activeMemberCount = await tx.user.count({
            where: {
              houseId: house.id,
              membershipStatus: MembershipStatus.ACTIVE,
            },
          });

          const membershipStatus =
            activeMemberCount === 0
              ? MembershipStatus.ACTIVE
              : MembershipStatus.PENDING;

          const user = await tx.user.create({
            data: {
              name,
              email,
              phone,
              passwordHash,
              role: UserRole.VILLAGER,
              villageId: village.id,
              houseId: house.id,
              membershipStatus,
              dateOfBirth,
            },
          });

          if (activeMemberCount === 0) {
            await tx.house.update({
              where: {
                id: house.id,
              },
              data: {
                headOfHouseId: user.id,
              },
            });
          }

          await createAuditLog(tx, {
            actionType: AuditActionType.CREATE,
            entityType: AuditEntityType.USER,
            entityId: user.id,
            villageId: village.id,
            actorUserId: user.id,
            metadata: {
              name,
              email,
              phone,
              role: UserRole.VILLAGER,
              newMembershipStatus: membershipStatus,
              houseId: house.id,
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      ),
    );

    revalidateVillageShell();
    return {
      success: true,
      redirectTo: "/login?registered=1",
    };
  } catch (error) {
    if (error instanceof RegistrationInputError) {
      return {
        success: false,
        formError: error.message,
      };
    }

    const prismaError = error as {
      code?: string;
      meta?: {
        target?: unknown;
      };
    };

    if (prismaError.code === "P2002") {
      const targetInfo = JSON.stringify(prismaError.meta?.target ?? "");
      if (targetInfo.includes("email")) {
        return {
          success: false,
          fieldErrors: {
            email: "An account with this email already exists.",
          },
        };
      }
      if (targetInfo.includes("phone")) {
        return {
          success: false,
          fieldErrors: {
            phone: "An account with this phone already exists.",
          },
        };
      }
      return {
        success: false,
        formError: "An account with those details already exists.",
      };
    }

    return {
      success: false,
      formError: "Unable to register. Please try again.",
    };
  }
}
