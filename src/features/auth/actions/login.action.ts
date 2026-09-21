"use server";

import { AuditActionType, UserRole, VillageStatus } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { verifyPassword } from "../../../lib/auth/password";
import { createSession } from "../../../lib/auth/session";
import {
  getSafeRedirectPath,
  validateLoginInput,
} from "../../../lib/auth/validators";
import { AuditEntityType, tryCreateAuditLog } from "../../../lib/audit";
import type { LoginResult } from "../../../lib/auth/auth.types";

const DUMMY_PASSWORD_HASH =
  "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const input = {
    identifier: getFormDataString(formData, "identifier"),
    password: getFormDataString(formData, "password"),
    redirectTo: getFormDataString(formData, "redirectTo") || undefined,
  };

  const validation = validateLoginInput(input);
  if (!validation.ok) {
    return { success: false, error: validation.error };
  }

  const { identifier, password, redirectTo } = validation.data;
  const genericError = "Invalid credentials.";

  const user = await prisma.user.findFirst({
    where:
      identifier.type === "email"
        ? { email: identifier.value }
        : { phone: identifier.value },
    select: {
      id: true,
      passwordHash: true,
      role: true,
      villageId: true,
      village: { select: { status: true } },
    },
  });

  const passwordIsValid = await verifyPassword(
    password,
    user?.passwordHash ?? DUMMY_PASSWORD_HASH,
  );

  if (!user || !passwordIsValid) {
    return { success: false, error: genericError };
  }

  if (user.role !== UserRole.SYSTEM_ADMIN) {
    if (!user.villageId || !user.village) {
      return { success: false, error: genericError };
    }
    if (user.village.status !== VillageStatus.ACTIVE) {
      return { success: false, error: genericError };
    }
  }

  await createSession(user.id);

  await tryCreateAuditLog(prisma, {
    actionType: AuditActionType.LOGIN,
    entityType: AuditEntityType.SESSION,
    entityId: user.id,
    villageId: user.villageId ?? null,
    actorUserId: user.id,
    metadata: { userRole: user.role, villageId: user.villageId },
  });

  return {
    success: true,
    redirectTo: getSafeRedirectPath(redirectTo),
  };
}
