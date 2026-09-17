"use server";

import { AuditActionType, MembershipStatus, Prisma } from "@prisma/client";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { prisma } from "../../../lib/prisma";
import { requireChief, getCurrentPeriod } from "../../../lib/authz";
import {
  validateAssignCollectorInput,
  type AssignCollectorField,
} from "../lib/collector-assignment-validators";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";

export type AssignCollectorActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<AssignCollectorField, string>>;
    };

export async function assignCollectorAction(
  formData: FormData,
): Promise<AssignCollectorActionResult> {
  const { user, villageId } = await requireChief();
  const currentPeriod = getCurrentPeriod();

  const validation = validateAssignCollectorInput(formData, currentPeriod);
  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }

  const { userId, year, month } = validation.data;

  const targetUser = await prisma.user.findFirst({
    where: {
      id: userId,
      villageId,
      membershipStatus: MembershipStatus.ACTIVE,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!targetUser) {
    return {
      success: false,
      fieldErrors: {
        userId: "Selected user is not an active member of this village.",
      },
    };
  }

  let assignmentId: string | undefined;

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const activeTarget = await tx.user.findFirst({
            where: {
              id: userId,
              villageId,
              membershipStatus: MembershipStatus.ACTIVE,
            },
            select: { id: true },
          });

          if (!activeTarget) {
            throw new Error("TARGET_USER_NOT_ELIGIBLE");
          }
          const existingActiveAssignment =
            await tx.collectorAssignment.findFirst({
              where: {
                villageId,
                year,
                month,
                isActive: true,
              },
              select: {
                id: true,
                userId: true,
              },
            });

          if (existingActiveAssignment) {
            if (existingActiveAssignment.userId === userId) {
              throw new Error("SAME_USER_ALREADY_ACTIVE_COLLECTOR");
            }

            throw new Error("ACTIVE_COLLECTOR_ALREADY_EXISTS");
          }

          const existingInactiveAssignment =
            await tx.collectorAssignment.findUnique({
              where: {
                villageId_userId_year_month: {
                  villageId,
                  userId,
                  year,
                  month,
                },
              },
              select: {
                id: true,
                isActive: true,
              },
            });

          let createdAssignmentId: string;

          if (existingInactiveAssignment) {
            const updated = await tx.collectorAssignment.update({
              where: {
                id: existingInactiveAssignment.id,
              },
              data: {
                isActive: true,
              },
            });

            createdAssignmentId = updated.id;
          } else {
            const created = await tx.collectorAssignment.create({
              data: {
                villageId,
                userId,
                year,
                month,
                isActive: true,
              },
            });

            createdAssignmentId = created.id;
          }

          assignmentId = createdAssignmentId;

          await createAuditLog(tx, {
            actionType: AuditActionType.ASSIGN,
            entityType: AuditEntityType.COLLECTOR_ASSIGNMENT,
            entityId: createdAssignmentId,
            villageId,
            actorUserId: user.id,
            metadata: {
              year,
              month,
              isActive: true,
              assignedUserName: targetUser.name,
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      ),
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "SAME_USER_ALREADY_ACTIVE_COLLECTOR") {
        return {
          success: false,
          formError:
            "This user is already the active Collector for the selected period.",
        };
      }

      if (error.message === "ACTIVE_COLLECTOR_ALREADY_EXISTS") {
        return {
          success: false,
          formError:
            "An active Collector already exists for the selected period. Deactivate the existing assignment first.",
        };
      }
    }

    return {
      success: false,
      formError: "Unable to assign collector. Please try again.",
    };
  }

  if (!assignmentId) {
    return {
      success: false,
      formError: "Unable to assign collector. Please try again.",
    };
  }

  return {
    success: true,
  };
}
