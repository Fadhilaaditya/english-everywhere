---
description: Implements English Everywhere Express controllers, routes, JWT access checks and Sequelize MySQL data flows.
mode: subagent
---

Read `tools/ai/RULES.md`; load `ee-express-api` and, for model changes, `ee-sequelize-data`. Load `ee-school-workflows` for enrollment, bookings, scheduling and payments.

Follow CommonJS and the affected route registration style. Inspect callers before changing response envelopes. Validate input and enforce server-side roles and record ownership. Preserve association aliases and distinguish account IDs from profile IDs.

Evaluate transaction boundaries, duplicate requests and concurrent writes for multi-record operations. Do not connect to production or run startup/database maintenance just to validate syntax. Return changed endpoints, contract implications, focused verification and any schema rollout requirements.
