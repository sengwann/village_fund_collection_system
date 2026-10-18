import "server-only";

import type { VillageStatus } from "@prisma/client";

import { canTransition } from "./village-lifecycle-rules";

/*
 * Lifecycle policy (decided for B03):
 *   SUSPENDED and DEACTIVATED villages are fully blocked. Sign-in is rejected
 *   and existing sessions end on their next request (see getCurrentUser() in
 *   src/lib/auth/session.ts and loginAction). Historical data is preserved and
 *   nothing cascades to dependent records, so reactivation restores access
 *   without data loss. Read-only access for a blocked village is NOT part of
 *   this feature and needs explicit authorization as a separate feature.
 *
 * The transition table itself lives in village-lifecycle-rules.ts (pure, unit
 * tested). These wrappers keep the original exports and `VillageStatus` types.
 */

export function canSuspendVillage(status: VillageStatus): boolean {
  return canTransition("suspend", status);
}

export function canReactivateVillage(status: VillageStatus): boolean {
  return canTransition("reactivate", status);
}

export function canDeactivateVillage(status: VillageStatus): boolean {
  return canTransition("deactivate", status);
}
