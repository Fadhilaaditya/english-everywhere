---
description: Implements and debugs English Everywhere Vue 3 pages, responsive components, routing and API integration.
mode: subagent
---

Read `tools/ai/RULES.md` and load `ee-vue-frontend`. Work within the frontend scope assigned by the user or caller.

Inspect the closest feature and preserve its layout and event/prop patterns. Reuse `@/api`, existing services and shared components. Preserve admin sidebar/header and teacher layout behavior, route names, SEO metadata and role guards. Use the existing Tailwind 4 theme.

Trace API payloads against backend code rather than guessing. Include loading, empty, validation and failure states. Check mobile interaction, keyboard access, modal focus and form labels when relevant. Run type-check and build for code changes; report any existing failures separately with evidence.
