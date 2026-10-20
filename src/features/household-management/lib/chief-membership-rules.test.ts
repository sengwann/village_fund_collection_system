import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MembershipStatus, UserRole } from "@prisma/client";

import {
  canChiefApproveFirstMember,
  canChiefRejectPendingMember,
} from "./chief-membership-rules.ts";

const CHIEF_ID = "chief-1";

const pendingVillager = {
  id: "user-1",
  role: UserRole.VILLAGER,
  membershipStatus: MembershipStatus.PENDING,
};

const headlessHouse = { isActive: true, headOfHouseId: null };

describe("canChiefApproveFirstMember", () => {
  it("allows a pending villager in an active headless house", () => {
    assert.equal(
      canChiefApproveFirstMember(pendingVillager, headlessHouse, CHIEF_ID),
      true,
    );
  });

  it("denies when the house already has a head", () => {
    assert.equal(
      canChiefApproveFirstMember(
        pendingVillager,
        { isActive: true, headOfHouseId: "head-1" },
        CHIEF_ID,
      ),
      false,
    );
  });

  it("denies an inactive house", () => {
    assert.equal(
      canChiefApproveFirstMember(
        pendingVillager,
        { isActive: false, headOfHouseId: null },
        CHIEF_ID,
      ),
      false,
    );
  });

  it("denies targets that are not pending", () => {
    for (const status of [
      MembershipStatus.ACTIVE,
      MembershipStatus.REJECTED,
      MembershipStatus.REMOVED,
      null,
    ]) {
      assert.equal(
        canChiefApproveFirstMember(
          { ...pendingVillager, membershipStatus: status },
          headlessHouse,
          CHIEF_ID,
        ),
        false,
      );
    }
  });

  it("denies non-villager targets", () => {
    assert.equal(
      canChiefApproveFirstMember(
        { ...pendingVillager, role: UserRole.CHIEF },
        headlessHouse,
        CHIEF_ID,
      ),
      false,
    );
  });

  it("denies the actor approving themselves", () => {
    assert.equal(
      canChiefApproveFirstMember(
        { ...pendingVillager, id: CHIEF_ID },
        headlessHouse,
        CHIEF_ID,
      ),
      false,
    );
  });
});

describe("canChiefRejectPendingMember", () => {
  it("allows a pending villager in a headless house", () => {
    assert.equal(
      canChiefRejectPendingMember(pendingVillager, headlessHouse, CHIEF_ID),
      true,
    );
  });

  it("allows clearing pending members of an inactive headless house", () => {
    assert.equal(
      canChiefRejectPendingMember(
        pendingVillager,
        { isActive: false, headOfHouseId: null },
        CHIEF_ID,
      ),
      true,
    );
  });

  it("denies once the house has a head", () => {
    assert.equal(
      canChiefRejectPendingMember(
        pendingVillager,
        { isActive: true, headOfHouseId: "head-1" },
        CHIEF_ID,
      ),
      false,
    );
  });

  it("denies targets that are not pending villagers", () => {
    assert.equal(
      canChiefRejectPendingMember(
        { ...pendingVillager, membershipStatus: MembershipStatus.ACTIVE },
        headlessHouse,
        CHIEF_ID,
      ),
      false,
    );
    assert.equal(
      canChiefRejectPendingMember(
        { ...pendingVillager, role: UserRole.SYSTEM_ADMIN },
        headlessHouse,
        CHIEF_ID,
      ),
      false,
    );
  });
});