import "server-only";

import { notFound, redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getCurrentUser } from "../auth/session";
import { LOGIN_ROUTE } from "../auth/auth.constants";
import type { SessionUser } from "../auth/auth.types";

export async function requireVillageResource(
  resource:
    | {
        villageId: string;
      }
    | null
    | undefined,
): Promise<void> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(LOGIN_ROUTE);
    return;
  }

  if (user.role === UserRole.SYSTEM_ADMIN || !user.villageId) {
    notFound();
    return;
  }

  if (!resource || resource.villageId !== user.villageId) {
    notFound();
    return;
  }
}

export async function requireResourceOwner(
  resourceUserId: string | null | undefined,
): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(LOGIN_ROUTE);
    return undefined as never;
  }

  if (!resourceUserId || resourceUserId !== user.id) {
    notFound();
    return undefined as never;
  }

  return user;
}

export async function requireVillageAndOwner(
  resource:
    | {
        villageId: string;
        userId: string;
      }
    | null
    | undefined,
): Promise<void> {
  if (!resource) {
    return notFound();
  }

  await requireVillageResource(resource);
  await requireResourceOwner(resource.userId);
}
