import "server-only";

import { notFound } from "next/navigation";
import { MembershipStatus, UserRole } from "@prisma/client";

import { prisma } from "../prisma";
import { requireAuthenticatedUser } from "../auth/guards";
import type { SessionUser } from "../auth/auth.types";

import { getActiveCollectorContext } from "./collector";
import { getVillageContext, hasActiveMembership } from "./context";
import { isSameVillage } from "./tenant";
import type { HouseAccessOptions, HouseAccessResult } from "./authz.types";

export async function checkHouseAccess(
  user: SessionUser,
  houseId: string,
  options: HouseAccessOptions,
): Promise<HouseAccessResult | null> {
  const villageContext = getVillageContext(user);

  if (!villageContext) {
    return null;
  }

  const house = await prisma.house.findUnique({
    where: {
      id: houseId,
    },
    select: {
      id: true,
      villageId: true,
      isActive: true,
      headOfHouseId: true,
    },
  });

  if (!house) {
    return null;
  }

  if (!isSameVillage(villageContext, house.villageId)) {
    return null;
  }

  const requireActiveHouse = options.requireActiveHouse ?? true;

  if (requireActiveHouse && !house.isActive) {
    return null;
  }

  for (const level of options.allowed) {
    if (level === "chief") {
      if (user.role === UserRole.CHIEF && hasActiveMembership(user)) {
        return house;
      }
    }

    if (level === "activeCollector") {
      const collectorContext = await getActiveCollectorContext(user);

      if (collectorContext) {
        return house;
      }
    }

    if (level === "member") {
      if (
        user.houseId === house.id &&
        user.membershipStatus === MembershipStatus.ACTIVE
      ) {
        return house;
      }
    }

    if (level === "head") {
      if (
        user.houseId === house.id &&
        user.membershipStatus === MembershipStatus.ACTIVE &&
        house.headOfHouseId === user.id
      ) {
        return house;
      }
    }
  }

  return null;
}

export async function requireHouseAccess(
  houseId: string,
  options: HouseAccessOptions,
): Promise<HouseAccessResult> {
  const user = await requireAuthenticatedUser();

  const result = await checkHouseAccess(user, houseId, options);

  if (!result) {
    return notFound();
  }

  return result;
}
