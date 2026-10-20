import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canDeactivateHouse,
  canEditHouseNumber,
  canReactivateHouse,
} from "./house-rules.ts";

describe("canEditHouseNumber", () => {
  it("is allowed; payment history does not block renaming", () => {
    assert.equal(canEditHouseNumber().allowed, true);
  });
});

describe("canDeactivateHouse", () => {
  it("allows an active house with no active or pending members", () => {
    assert.equal(
      canDeactivateHouse({ isActive: true, hasActiveOrPendingMembers: false })
        .allowed,
      true,
    );
  });

  it("blocks a house with active or pending members", () => {
    const result = canDeactivateHouse({
      isActive: true,
      hasActiveOrPendingMembers: true,
    });
    assert.equal(result.allowed, false);
    assert.ok(result.reason);
  });

  it("blocks an already inactive house", () => {
    const result = canDeactivateHouse({
      isActive: false,
      hasActiveOrPendingMembers: false,
    });
    assert.equal(result.allowed, false);
    assert.ok(result.reason);
  });
});

describe("canReactivateHouse", () => {
  it("allows an inactive house", () => {
    assert.equal(canReactivateHouse({ isActive: false }).allowed, true);
  });

  it("blocks an already active house", () => {
    assert.equal(canReactivateHouse({ isActive: true }).allowed, false);
  });
});
