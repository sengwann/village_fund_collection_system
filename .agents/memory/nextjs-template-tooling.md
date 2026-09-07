---
name: Next.js template tooling
description: Compatibility notes for the Next.js App Router starter toolchain.
---

Next.js 16 uses the standalone ESLint CLI rather than the removed `next lint` command. The current Next lint preset also needs an ESLint 9-compatible setup and may lag behind the newest TypeScript major.

**Why:** A fresh install selected newer major versions that made the default lint script fail even though the app built correctly.

**How to apply:** Keep the template on `eslint .` with the Next flat config, and verify TypeScript/ESLint peer compatibility together when upgrading.