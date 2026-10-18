import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { sanitizeRedirectPath } from "./safe-redirect.ts";

const FALLBACK = "/dashboard";

function check(input: string | null | undefined): string {
  return sanitizeRedirectPath(input, FALLBACK);
}

describe("sanitizeRedirectPath", () => {
  it("allows same-origin paths, queries and hashes", () => {
    assert.equal(check("/village/funds"), "/village/funds");
    assert.equal(
      check("/village/funds?status=ACTIVE"),
      "/village/funds?status=ACTIVE",
    );
    assert.equal(check("/settings#profile"), "/settings#profile");
    assert.equal(check("  /village/houses  "), "/village/houses");
  });

  it("falls back for empty or missing values", () => {
    assert.equal(check(undefined), FALLBACK);
    assert.equal(check(null), FALLBACK);
    assert.equal(check(""), FALLBACK);
    assert.equal(check("   "), FALLBACK);
  });

  it("rejects absolute and protocol-relative URLs", () => {
    assert.equal(check("https://evil.com"), FALLBACK);
    assert.equal(check("//evil.com"), FALLBACK);
    assert.equal(check("evil.com/path"), FALLBACK);
    assert.equal(check("javascript:alert(1)"), FALLBACK);
    assert.equal(check("data:text/html,x"), FALLBACK);
  });

  it("rejects backslash tricks", () => {
    assert.equal(check("/\\evil.com"), FALLBACK);
    assert.equal(check("\\\\evil.com"), FALLBACK);
    assert.equal(check("/a\\b"), FALLBACK);
  });

  it("rejects control characters that browsers strip from URLs", () => {
    assert.equal(check("/\t/evil.com"), FALLBACK);
    assert.equal(check("/\n/evil.com"), FALLBACK);
    assert.equal(check("/\r/evil.com"), FALLBACK);
    assert.equal(check("/\t\t/evil.com"), FALLBACK);
    assert.equal(check("/ok\u0000"), FALLBACK);
    assert.equal(check("/ok\u007f"), FALLBACK);
    assert.equal(check("/ok\u0085"), FALLBACK);
    assert.equal(check("/ok\u2028"), FALLBACK);
    assert.equal(check("\t//evil.com"), FALLBACK);
    assert.equal(check("/ok\n"), FALLBACK);
  });

  it("keeps percent-encoded control characters as a plain same-origin path", () => {
    assert.equal(check("/%09/evil.com"), "/%09/evil.com");
  });

  it("rejects the login page in all common shapes", () => {
    assert.equal(check("/login"), FALLBACK);
    assert.equal(check("/LOGIN"), FALLBACK);
    assert.equal(check("/login/"), FALLBACK);
    assert.equal(check("/login?redirect=/x"), FALLBACK);
    assert.equal(check("/login#x"), FALLBACK);
    assert.equal(check("/login-help"), "/login-help");
  });

  it("rejects overly long values", () => {
    assert.equal(check(`/${"a".repeat(2048)}`), FALLBACK);
  });
});
