"use server";

import { redirect } from "next/navigation";
import { AuditActionType } from "@prisma/client";
import { destroySession, getCurrentUser } from "../../../lib/auth/session";
import { LOGIN_ROUTE } from "../../../lib/auth/auth.constants";
import { prisma } from "../../../lib/prisma";
import { AuditEntityType, tryCreateAuditLog } from "../../../lib/audit";

export async function logoutAction(): Promise<void> {
  const user = await getCurrentUser();

  if (user) {
    await tryCreateAuditLog(prisma, {
      actionType: AuditActionType.LOGOUT,
      entityType: AuditEntityType.SESSION,
      entityId: user.id,
      villageId: user.villageId ?? null,
      actorUserId: user.id,
      metadata: {
        userRole: user.role,
        villageId: user.villageId,
      },
    });
  }

  await destroySession();
  redirect(LOGIN_ROUTE);
}
