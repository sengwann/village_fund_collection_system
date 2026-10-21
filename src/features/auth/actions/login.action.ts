"use server";

import { AuditActionType, UserRole, VillageStatus } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { verifyPassword } from "../../../lib/auth/password";
import { createSession } from "../../../lib/auth/session";
import {
  getSafeRedirectPath,
  validateLoginInput,
} from "../../../lib/auth/validators";
import {
  AUTH_INVALID_CREDENTIALS_MESSAGE,
  AUTH_THROTTLED_MESSAGE,
} from "../../../lib/auth/auth.constants";
import { getClientIp } from "../../../lib/auth/client-ip";
import {
  clearLoginThrottle,
  maybeCleanupLoginThrottle,
  reserveLoginAttempt,
} from "../../../lib/auth/login-throttle";
import { AuditEntityType, tryCreateAuditLog } from "../../../lib/audit";
import type { LoginResult } from "../../../lib/auth/auth.types";

const DUMMY_PASSWORD_HASH =
  "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function invalidCredentials(): LoginResult {
  return {
    success: false,
    code: "INVALID_CREDENTIALS",
    error: AUTH_INVALID_CREDENTIALS_MESSAGE,
  };
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const input = {
    identifier: getFormDataString(formData, "identifier"),
    password: getFormDataString(formData, "password"),
    redirectTo: getFormDataString(formData, "redirectTo") || undefined,
  };

  // Malformed input costs no bcrypt work, so it is not counted.
  const validation = validateLoginInput(input);
  if (!validation.ok) {
    return invalidCredentials();
  }

  const { identifier, password, redirectTo } = validation.data;

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

  // Known accounts are throttled by user id, so email and phone attempts
  // against the same account share one counter.
  const identityKey = user
    ? `user:${user.id}`
    : `identifier:${identifier.type}:${identifier.value}`;

  const clientIp = await getClientIp();

  // Count the attempt BEFORE checking the password (atomic, race-free).
  const throttle = await reserveLoginAttempt(prisma, { identityKey, clientIp });

  for (const lockout of throttle.newLockouts) {
    const isAccountScope = lockout.scope === "IDENTIFIER_IP";
    // Skip unknown-identifier lockouts so attackers cannot flood the audit log.
    if (isAccountScope && !user) continue;

    // Best-effort; never interrupts or bypasses enforcement.
    await tryCreateAuditLog(prisma, {
      actionType: AuditActionType.LOGIN_THROTTLED,
      entityType: AuditEntityType.SESSION,
      entityId: isAccountScope ? (user?.id ?? null) : null,
      villageId: isAccountScope ? (user?.villageId ?? null) : null,
      actorUserId: null,
      metadata: {
        scope: lockout.scope,
        attemptLimit: lockout.attemptLimit,
        cooldownSeconds: lockout.cooldownSeconds,
        keyFingerprint: lockout.keyFingerprint,
      },
    });
  }

  if (throttle.blocked) {
    return {
      success: false,
      code: "THROTTLED",
      error: AUTH_THROTTLED_MESSAGE,
      retryAfterSeconds: throttle.retryAfterSeconds,
    };
  }

  const passwordIsValid = await verifyPassword(
    password,
    user?.passwordHash ?? DUMMY_PASSWORD_HASH,
  );

  if (!user || !passwordIsValid) {
    await maybeCleanupLoginThrottle(prisma);
    return invalidCredentials();
  }

  if (user.role !== UserRole.SYSTEM_ADMIN) {
    if (!user.villageId || !user.village) {
      return invalidCredentials();
    }
    if (user.village.status !== VillageStatus.ACTIVE) {
      return invalidCredentials();
    }
  }

  await clearLoginThrottle(prisma, throttle.identifierKeyHash);

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
