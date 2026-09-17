import "server-only";

import { VillageStatus } from "@prisma/client";

export function canSuspendVillage(status: VillageStatus): boolean {
  return status === VillageStatus.ACTIVE;
}

export function canReactivateVillage(status: VillageStatus): boolean {
  return status === VillageStatus.SUSPENDED;
}

export function canDeactivateVillage(status: VillageStatus): boolean {
  return status === VillageStatus.ACTIVE || status === VillageStatus.SUSPENDED;
}
