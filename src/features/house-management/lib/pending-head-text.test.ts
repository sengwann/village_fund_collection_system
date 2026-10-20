import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getPendingHeadText, pendingHeadText } from "./pending-head-text.ts";

describe("pendingHeadText", () => {
  it("has the same keys in English and Myanmar", () => {
    assert.deepEqual(
      Object.keys(pendingHeadText.MY).sort(),
      Object.keys(pendingHeadText.EN).sort(),
    );
  });

  it("has no empty strings", () => {
    for (const language of ["EN", "MY"] as const) {
      for (const value of Object.values(pendingHeadText[language])) {
        assert.ok(value.trim().length > 0);
      }
    }
  });

  it("keeps the placeholders the component fills in", () => {
    for (const language of ["EN", "MY"] as const) {
      const text = getPendingHeadText(language);
      assert.ok(text.registered.includes("{date}"));
      assert.ok(text.approveConfirmBody.includes("{name}"));
    }
  });
});