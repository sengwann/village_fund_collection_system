import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getUtf8ByteLength,
  normalizeVillageCode,
  validateChiefName,
  validatePassword,
  validateVillageCode,
  validateVillageName,
} from "./village-validation-rules.ts";

describe("normalizeVillageCode", () => {
  it("trims, uppercases and removes inner whitespace", () => {
    assert.equal(normalizeVillageCode("  dev 101 "), "DEV101");
    assert.equal(normalizeVillageCode("ab\tc"), "ABC");
  });
});

describe("validateVillageCode", () => {
  it("accepts 3 to 20 letters or digits", () => {
    assert.equal(validateVillageCode("ABC"), null);
    assert.equal(validateVillageCode("A1B2C3"), null);
    assert.equal(validateVillageCode("A".repeat(20)), null);
  });

  it("rejects too short, too long and symbols", () => {
    assert.equal(validateVillageCode("AB"), "CODE_INVALID");
    assert.equal(validateVillageCode("A".repeat(21)), "CODE_INVALID");
    assert.equal(validateVillageCode("AB-1"), "CODE_INVALID");
    assert.equal(validateVillageCode(""), "CODE_INVALID");
    assert.equal(validateVillageCode("ကျေးရွာ"), "CODE_INVALID");
  });
});

describe("validateVillageName and validateChiefName", () => {
  it("accepts 2 to 100 characters", () => {
    assert.equal(validateVillageName("Ab"), null);
    assert.equal(validateVillageName("a".repeat(100)), null);
    assert.equal(validateChiefName("Ab"), null);
    assert.equal(validateChiefName("a".repeat(100)), null);
  });

  it("rejects 1 and 101 characters", () => {
    assert.equal(validateVillageName("a"), "NAME_LENGTH");
    assert.equal(validateVillageName("a".repeat(101)), "NAME_LENGTH");
    assert.equal(validateChiefName("a"), "CHIEF_NAME_LENGTH");
    assert.equal(validateChiefName("a".repeat(101)), "CHIEF_NAME_LENGTH");
  });

  it("accepts Burmese names", () => {
    assert.equal(validateVillageName("ရွာသစ်"), null);
    assert.equal(validateChiefName("မောင်မောင်"), null);
  });
});

describe("validatePassword", () => {
  it("accepts 8 to 72 ASCII characters", () => {
    assert.equal(validatePassword("a".repeat(8)), null);
    assert.equal(validatePassword("a".repeat(72)), null);
  });

  it("rejects fewer than 8 and more than 72 characters", () => {
    assert.equal(validatePassword("a".repeat(7)), "PASSWORD_LENGTH");
    assert.equal(validatePassword(""), "PASSWORD_LENGTH");
    assert.equal(validatePassword("a".repeat(73)), "PASSWORD_LENGTH");
  });

  it("does not trim the password", () => {
    assert.equal(validatePassword("       a"), null);
  });

  it("limits the password to 72 bytes, not only 72 characters", () => {
    // Each Burmese consonant is 3 bytes in UTF-8.
    assert.equal(getUtf8ByteLength("က"), 3);
    assert.equal(validatePassword("က".repeat(24)), null);
    assert.equal(validatePassword("က".repeat(25)), "PASSWORD_TOO_LONG");
  });

  it("counts a mixed password by bytes", () => {
    // 66 ASCII bytes + 2 Burmese characters (6 bytes) = 72 bytes.
    assert.equal(validatePassword("a".repeat(66) + "ကက"), null);
    // One more ASCII character makes it 73 bytes.
    assert.equal(validatePassword("a".repeat(67) + "ကက"), "PASSWORD_TOO_LONG");
  });
});
("");
