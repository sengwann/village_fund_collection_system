"use server";
import { AuditActionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { AuditEntityType, createAuditLog } from "@/lib/audit";
import {
  validatePasswordInput,
  type PasswordField,
} from "../lib/settings-validators";

export type ChangePasswordActionResult =
  | { success: true }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<PasswordField, string>>;
    };

export async function changePasswordAction(
  formData: FormData,
): Promise<ChangePasswordActionResult> {
  const user = await requireAuthenticatedUser();

  const validation = validatePasswordInput(formData);
  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }

  const { currentPassword, newPassword } = validation.data;

  // Load the user's current password hash from the database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, passwordHash: true },
  });

  if (!dbUser) {
    return {
      success: false,
      formError: "Unable to verify account. Please try again.",
    };
  }

  // Verify current password
  const isValid = await verifyPassword(currentPassword, dbUser.passwordHash);
  if (!isValid) {
    return {
      success: false,
      fieldErrors: {
        currentPassword: "Current password is incorrect.",
      },
    };
  }

  // Hash and store new password
  const newPasswordHash = await hashPassword(newPassword);

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    await createAuditLog(prisma, {
      actionType: AuditActionType.UPDATE,
      entityType: AuditEntityType.USER,
      entityId: user.id,
      villageId: user.villageId ?? null,
      actorUserId: user.id,
      metadata: { note: "password_changed" },
    });
  } catch {
    return {
      success: false,
      formError: "Unable to change password. Please try again.",
    };
  }

  return { success: true };
}
