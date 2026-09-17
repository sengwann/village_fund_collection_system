import "server-only";

export interface HouseRuleContext {
  isActive: boolean;
  hasActiveOrPendingMembers: boolean;
  hasPayments: boolean;
}

export function canEditHouseNumber(ctx: HouseRuleContext): {
  allowed: boolean;
  reason?: string;
} {
  if (ctx.hasPayments) {
    return {
      allowed: false,
      reason:
        "House number cannot be edited because this house has payment records.",
    };
  }
  return { allowed: true };
}

export function canDeactivateHouse(ctx: HouseRuleContext): {
  allowed: boolean;
  reason?: string;
} {
  if (!ctx.isActive) {
    return { allowed: false, reason: "This house is already inactive." };
  }
  if (ctx.hasActiveOrPendingMembers) {
    return {
      allowed: false,
      reason: "A house with active or pending members cannot be deactivated.",
    };
  }
  if (ctx.hasPayments) {
    return {
      allowed: false,
      reason: "A house with payment records cannot be deactivated.",
    };
  }
  return { allowed: true };
}

export function canReactivateHouse(ctx: HouseRuleContext): {
  allowed: boolean;
  reason?: string;
} {
  if (ctx.isActive) {
    return { allowed: false, reason: "This house is already active." };
  }
  return { allowed: true };
}
