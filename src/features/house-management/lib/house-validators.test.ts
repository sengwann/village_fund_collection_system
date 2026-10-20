import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  normalizeHouseNumber,
  validateHouseNumber,
} from "./house-validators.ts";

function accepted(raw: string): string {
  const result = validateHouseNumber(raw);
  assert.equal(result.ok, true, `expected "${raw}" to be accepted`);
  if (!result.ok) throw new Error("unreachable");
  return result.data.houseNumber;
}

function rejected(raw: string): string | undefined {
  const result = validateHouseNumber(raw);
  assert.equal(result.ok, false, `expected "${raw}" to be rejected`);
  if (result.ok) throw new Error("unreachable");
  return result.fieldErrors.houseNumber;
}

describe("validateHouseNumber", () => {
  it("accepts Latin numbers and normalizes case and spaces", () => {
    assert.equal(accepted("  a-1  "), "A-1");
    assert.equal(accepted("12   B"), "12 B");
    assert.equal(accepted("12/3 (rear)"), "12/3 (REAR)");
  });

  it("accepts Myanmar digits only", () => {
    assert.equal(accepted("\u1041\u1042"), "\u1041\u1042");
  });

  it("accepts Myanmar letters with a separator and digit", () => {
    assert.equal(accepted("\u1000/\u1043"), "\u1000/\u1043");
  });

  it("accepts mixed Myanmar and Latin input", () => {
    assert.equal(accepted("\u1000-12"), "\u1000-12");
  });

  it("treats Myanmar and Latin digits as different values", () => {
    assert.notEqual(accepted("\u1041\u1042"), accepted("12"));
  });

  it("rejects punctuation-only input", () => {
    assert.match(rejected("--") ?? "", /at least one letter or number/);
    assert.match(rejected("(.)") ?? "", /at least one letter or number/);
  });

  it("rejects Myanmar punctuation without letters or digits", () => {
    assert.match(
      rejected("\u104B\u104B") ?? "",
      /at least one letter or number/,
    );
  });

  it("rejects characters outside the allowed set", () => {
    assert.match(rejected("A@1") ?? "", /can only contain/);
  });

  it("rejects empty, too short and too long values", () => {
    assert.equal(rejected("   "), "House number is required.");
    assert.match(rejected("A") ?? "", /between 2 and 30/);
    assert.match(rejected("A".repeat(31)) ?? "", /between 2 and 30/);
  });
});

describe("normalizeHouseNumber", () => {
  it("treats canonically equivalent input as equal (NFC)", () => {
    assert.equal(
      normalizeHouseNumber("e\u0301"),
      normalizeHouseNumber("\u00e9"),
    );
  });
});
