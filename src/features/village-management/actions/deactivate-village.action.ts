"use server";

import { redirect } from "next/navigation";
import { AuditActionType, VillageStatus } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { requireSystemAdmin } from "../../../lib/authz";
import { canDeactivateVillage } from "../lib/village-lifecycle";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";
import { withSerializableRetry } from "../../../lib/db/transaction";

function getFormDataVillageId(formData: FormData): string {
  const value = formData.get("villageId");

  if (typeof value === "string") {
    return value;
  }

  return "";
}

export async function deactivateVillageAction(
  formData: FormData,
): Promise<void> {
  const admin = await requireSystemAdmin();

  const villageId = getFormDataVillageId(formData);

  if (!villageId) {
    redirect("/admin/villages");
  }

  await withSerializableRetry(() =>
    prisma.$transaction(
      async (tx) => {
        const village = await tx.village.findUnique({
          where: {
            id: villageId,
          },
          select: {
            id: true,
            villageCode: true,
            name: true,
            status: true,
          },
        });

        if (!village) {
          redirect("/admin/villages");
        }

        if (!canDeactivateVillage(village.status)) {
          redirect(`/admin/villages/${villageId}`);
        }

        await tx.village.update({
          where: {
            id: village.id,
          },
          data: {
            status: VillageStatus.DEACTIVATED,
          },
        });

        await createAuditLog(tx, {
          actionType: AuditActionType.STATUS_CHANGE,
          entityType: AuditEntityType.VILLAGE,
          entityId: village.id,
          villageId: village.id,
          actorUserId: admin.id,
          metadata: {
            villageCode: village.villageCode,
            name: village.name,
            previousStatus: village.status,
            newStatus: VillageStatus.DEACTIVATED,
          },
        });
      },
      {
        isolationLevel: "Serializable",
      },
    ),
  );

  redirect(`/admin/villages/${villageId}`);
}
