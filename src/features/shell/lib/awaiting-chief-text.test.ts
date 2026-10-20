import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  awaitingChiefText,
  getAwaitingChiefText,
} from "./awaiting-chief-text.ts";

describe("awaitingChiefText", () => {
  it("has the same keys in English and Myanmar", () => {
    assert.deepEqual(
      Object.keys(awaitingChiefText.MY).sort(),
      Object.keys(awaitingChiefText.EN).sort(),
    );
  });

  it("has no empty strings", () => {
    for (const language of ["EN", "MY"] as const) {
      const text = getAwaitingChiefText(language);
      assert.ok(text.banner.trim().length > 0);
      assert.ok(text.dashboardBody.trim().length > 0);
    }
  });
});