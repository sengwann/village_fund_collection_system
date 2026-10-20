import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getDeactivateBlockedKey, interpolate } from "./house-ui.ts";

describe("interpolate", () => {
  it("replaces known placeholders", () => {
    assert.equal(
      interpolate("House {number} has {count}", { number: "A-1", count: 3 }),
      "House A-1 has 3",
    );
  });

  it("leaves unknown placeholders untouched", () => {
    assert.equal(interpolate("Hello {name}", {}), "Hello {name}");
  });
});

describe("getDeactivateBlockedKey", () => {
  it("explains blocking by members", () => {
    assert.equal(
      getDeactivateBlockedKey({
        isActive: true,
        hasActiveOrPendingMembers: true,
      }),
      "houses.deactivate.blockedMembers",
    );
  });

  it("returns null when members do not block", () => {
    assert.equal(
      getDeactivateBlockedKey({
        isActive: true,
        hasActiveOrPendingMembers: false,
      }),
      null,
    );
  });
});
