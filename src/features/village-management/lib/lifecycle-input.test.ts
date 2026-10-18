import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  REASON_MAX_LENGTH,
  VILLAGE_ID_MAX_LENGTH,
  parseLifecycleInput,
  parseReason,
  parseVillageId,
} from "./lifecycle-input.ts";

function form(entries: Record<string, string>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value);
  }

  return formData;
}

describe("parseVillageId", () => {
  it("accepts a cuid-like id", () => {
    assert.equal(parseVillageId("clx0abc123def456ghi789jkl"), "clx0abc123def456ghi789jkl");
  });

  it("trims surrounding whitespace", () => {
    assert.equal(parseVillageId("  abc  "), "abc");
  });

  it("rejects missing, non-string, empty and blank values", () => {
    assert.equal(parseVillageId(null), null);
    assert.equal(parseVillageId(undefined), null);
    assert.equal(parseVillageId(42), null);
    assert.equal(parseVillageId(""), null);
    assert.equal(parseVillageId("   "), null);
  });

  it("enforces the length bound", () => {
    assert.equal(
      parseVillageId("a".repeat(VILLAGE_ID_MAX_LENGTH)),
      "a".repeat(VILLAGE_ID_MAX_LENGTH),
    );
    assert.equal(parseVillageId("a".repeat(VILLAGE_ID_MAX_LENGTH + 1)), null);
  });
});

describe("parseReason", () => {
  it("treats missing and empty reasons as no reason", () => {
    assert.deepEqual(parseReason(null), { ok: true, reason: null });
    assert.deepEqual(parseReason(undefined), { ok: true, reason: null });
    assert.deepEqual(parseReason(""), { ok: true, reason: null });
    assert.deepEqual(parseReason("   \n "), { ok: true, reason: null });
  });

  it("trims a reason", () => {
    assert.deepEqual(parseReason("  unpaid fees  "), {
      ok: true,
      reason: "unpaid fees",
    });
  });

  it("accepts exactly the maximum length and rejects one more", () => {
    assert.deepEqual(parseReason("a".repeat(REASON_MAX_LENGTH)), {
      ok: true,
      reason: "a".repeat(REASON_MAX_LENGTH),
    });
    assert.deepEqual(parseReason("a".repeat(REASON_MAX_LENGTH + 1)), {
      ok: false,
    });
  });

  it("counts Burmese characters and emoji as characters", () => {
    const burmese = "က".repeat(REASON_MAX_LENGTH);
    assert.deepEqual(parseReason(burmese), { ok: true, reason: burmese });
    assert.deepEqual(parseReason(burmese + "က"), { ok: false });

    const emoji = "😀".repeat(REASON_MAX_LENGTH);
    assert.deepEqual(parseReason(emoji), { ok: true, reason: emoji });
    assert.deepEqual(parseReason(emoji + "😀"), { ok: false });
  });

  it("ignores a non-string form entry", () => {
    assert.deepEqual(parseReason(new File(["x"], "x.txt")), {
      ok: true,
      reason: null,
    });
  });
});

describe("parseLifecycleInput", () => {
  it("returns the village id and no reason when the reason is absent", () => {
    assert.deepEqual(parseLifecycleInput(form({ villageId: "abc" })), {
      ok: true,
      villageId: "abc",
      reason: null,
    });
  });

  it("returns a trimmed reason", () => {
    assert.deepEqual(
      parseLifecycleInput(form({ villageId: "abc", reason: " audit " })),
      { ok: true, villageId: "abc", reason: "audit" },
    );
  });

  it("rejects an invalid village id", () => {
    assert.deepEqual(parseLifecycleInput(form({ reason: "x" })), {
      ok: false,
      error: "INVALID_VILLAGE_ID",
    });
    assert.deepEqual(parseLifecycleInput(form({ villageId: " " })), {
      ok: false,
      error: "INVALID_VILLAGE_ID",
    });
  });

  it("reports an over-long reason together with the village id", () => {
    assert.deepEqual(
      parseLifecycleInput(
        form({ villageId: "abc", reason: "a".repeat(REASON_MAX_LENGTH + 1) }),
      ),
      { ok: false, error: "REASON_TOO_LONG", villageId: "abc" },
    );
  });

  it("checks the village id before the reason", () => {
    assert.deepEqual(
      parseLifecycleInput(
        form({ villageId: "", reason: "a".repeat(REASON_MAX_LENGTH + 1) }),
      ),
      { ok: false, error: "INVALID_VILLAGE_ID" },
    );
  });
});