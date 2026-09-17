"use server";

import { redirect } from "next/navigation";
import { AuditActionType } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { requireChief } from "../../../lib/authz";
import { canDeactivateAssignment } from "../lib/collector-assignment-rules";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value;
  }
  return "";
}

export async function deactivateCollectorAssignmentAction(
  formData: FormData,
): Promise<void> {
  const { user, villageId } = await requireChief();

  const assignmentId = getFormDataString(formData, "assignmentId");
  if (!assignmentId) {
    redirect("/village/collectors");
  }

  const assignment = await prisma.collectorAssignment.findFirst({
    where: {
      id: assignmentId,
      villageId,
    },
    select: {
      id: true,
      isActive: true,
      year: true,
      month: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!assignment) {
    redirect("/village/collectors");
  }

  if (!canDeactivateAssignment(assignment.isActive)) {
    redirect("/village/collectors");
  }

  await prisma.collectorAssignment.update({
    where: {
      id: assignment.id,
    },
    data: {
      isActive: false,
    },
  });

  await createAuditLog(prisma, {
    actionType: AuditActionType.STATUS_CHANGE,
    entityType: AuditEntityType.COLLECTOR_ASSIGNMENT,
    entityId: assignment.id,
    villageId,
    actorUserId: user.id,
    metadata: {
      year: assignment.year,
      month: assignment.month,
      isActive: false,
      assignedUserName: assignment.user.name,
    },
  });

  redirect("/village/collectors");
}
