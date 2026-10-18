import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  LIFECYCLE_TARGET_STATUS,
  canTransition,
  type VillageLifecycleAction,
  type VillageLifecycleStatus,
} from "./village-lifecycle-rules.ts";

const STATUSES: VillageLifecycleStatus[] = [
  "ACTIVE",
  "SUSPENDED",
  "DEACTIVATED",
];

const EXPECTED: Record<VillageLifecycleAction, VillageLifecycleStatus[]> = {
  suspend: ["ACTIVE"],
  reactivate: ["SUSPENDED"],
  deactivate: ["ACTIVE", "SUSPENDED"],
};

describe("canTransition", () => {
  for (const action of Object.keys(EXPECTED) as VillageLifecycleAction[]) {
    for (const status of STATUSES) {
      const allowed = EXPECTED[action].includes(status);

      it(`${action} from ${status} is ${allowed ? "allowed" : "rejected"}`, () => {
        assert.equal(canTransition(action, status), allowed);
      });
    }
  }

  it("never allows any action once a village is deactivated", () => {
    for (const action of Object.keys(EXPECTED) as VillageLifecycleAction[]) {
      assert.equal(canTransition(action, "DEACTIVATED"), false);
    }
  });
});

describe("LIFECYCLE_TARGET_STATUS", () => {
  it("maps each action to its target status", () => {
    assert.deepEqual(LIFECYCLE_TARGET_STATUS, {
      suspend: "SUSPENDED",
      reactivate: "ACTIVE",
      deactivate: "DEACTIVATED",
    });
  });

  it("never targets a status the action is already allowed to start from", () => {
    for (const action of Object.keys(EXPECTED) as VillageLifecycleAction[]) {
      assert.equal(
        canTransition(action, LIFECYCLE_TARGET_STATUS[action]),
        false,
      );
    }
  });
});
