import "server-only";
import { FundStatus, MembershipStatus, UserRole } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { requireAuthenticatedUser } from "../../../lib/auth/guards";
import { redirectForbidden } from "../../../lib/authz/authz.errors";
import type { SessionUser } from "../../../lib/auth/auth.types";

export interface KpayPaymentAccessContext {
  user: SessionUser;
  villageId: string;
  houseId: string;
  fund: {
    id: string;
    name: string;
    targetAmount: number;
  } | null;
}

export async function requireKpayPaymentAccess(): Promise<KpayPaymentAccessContext> {
  const user = await requireAuthenticatedUser();

  if (user.role !== UserRole.VILLAGER) {
    return redirectForbidden();
  }

  if (user.membershipStatus !== MembershipStatus.ACTIVE) {
    return redirectForbidden();
  }

  if (!user.villageId || !user.houseId) {
    return redirectForbidden();
  }

  const house = await prisma.house.findUnique({
    where: { id: user.houseId },
    select: { id: true, isActive: true, villageId: true },
  });

  if (!house || !house.isActive || house.villageId !== user.villageId) {
    return redirectForbidden();
  }

  const fund = await prisma.fund.findFirst({
    where: {
      villageId: user.villageId,
      status: FundStatus.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      targetAmount: true,
    },
  });

  return {
    user,
    villageId: user.villageId,
    houseId: user.houseId,
    fund,
  };
}
