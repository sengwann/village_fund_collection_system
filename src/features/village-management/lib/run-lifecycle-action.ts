import "server-only";

import { redirect } from "next/navigation";

import { changeVillageStatus } from "./change-village-status";
import {
  LIFECYCLE_ERROR_PARAM,
  LIFECYCLE_ERROR_REASON_TOO_LONG,
  parseLifecycleInput,
} from "./lifecycle-input";
import type { VillageLifecycleAction } from "./village-lifecycle-rules";

const VILLAGES_LIST_PATH = "/admin/villages";

function getVillageDetailPath(villageId: string): string {
  return `${VILLAGES_LIST_PATH}/${encodeURIComponent(villageId)}`;
}

/*
 * Shared body of the three lifecycle server actions. The action files stay thin
 * and call requireSystemAdmin() themselves; this runs after that check.
 * Behavior is unchanged: a missing village goes to the list, anything else
 * (including a transition that is not allowed) goes to the detail page.
 */
export async function runVillageLifecycleAction(params: {
  action: VillageLifecycleAction;
  formData: FormData;
  actorUserId: string;
}): Promise<never> {
  const input = parseLifecycleInput(params.formData);

  if (!input.ok) {
    if (input.error === "REASON_TOO_LONG") {
      redirect(
        `${getVillageDetailPath(input.villageId)}?${LIFECYCLE_ERROR_PARAM}=${LIFECYCLE_ERROR_REASON_TOO_LONG}`,
      );
    }

    redirect(VILLAGES_LIST_PATH);
  }

  const outcome = await changeVillageStatus({
    villageId: input.villageId,
    action: params.action,
    actorUserId: params.actorUserId,
    reason: input.reason,
  });

  if (outcome === "not_found") {
    redirect(VILLAGES_LIST_PATH);
  }

  redirect(getVillageDetailPath(input.villageId));
}