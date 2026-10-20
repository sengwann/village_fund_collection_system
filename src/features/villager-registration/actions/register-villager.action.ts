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

type PrismaLikeError = {
  code?: string;
  message?: string;
  meta?: unknown;
};

/**
 * Collects every place a unique-constraint error may name the violated field.
 * With the classic engine this is `meta.target`; with driver adapters (the pg
 * adapter used here) the details can sit under `meta.driverAdapterError`, or
 * only appear in the message. Search them all.
 */
function getUniqueViolationInfo(error: PrismaLikeError): string {
  let metaText = "";
  try {
    metaText = JSON.stringify(error.meta ?? "");
  } catch {
    metaText = "";
  }
  return `${metaText} ${error.message ?? ""}`.toLowerCase();
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

          // Every new registrant is PENDING and is never made Head of House
          // here. If the house has a head, that head approves the request.
          // If the house has no head yet, the Village Chief decides (see the
          // chief approve/reject actions in household-management).
          const membershipStatus = MembershipStatus.PENDING;

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

    const prismaError = error as PrismaLikeError;

    if (prismaError.code === "P2002") {
      const info = getUniqueViolationInfo(prismaError);
      const emailViolation = info.includes("email");
      const phoneViolation = info.includes("phone");

      if (emailViolation && !phoneViolation) {
        return {
          success: false,
          fieldErrors: {
            email: "An account with this email already exists.",
          },
        };
      }
      if (phoneViolation && !emailViolation) {
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
