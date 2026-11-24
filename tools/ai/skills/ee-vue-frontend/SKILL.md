---
name: ee-vue-frontend
description: Use when implementing or debugging English Everywhere Vue SFCs, frontend/src views, Tailwind styles, Vue Router navigation or Axios service integration.
---

# English Everywhere Vue Frontend

## Read first

Read `tools/ai/RULES.md`, the closest feature under `frontend/src/views/`, `frontend/src/router/index.ts`, and `frontend/src/api/index.ts`. Read `frontend/src/assets/main.css` for styling work. Inspect package versions before using library-specific syntax; fetch current docs when necessary.

## Workflow

1. Identify public/student, admin or teacher ownership. Feature-specific components belong in that feature's `_components/`; reusable components belong in `src/components/`.
2. Use Composition API with `<script setup lang="ts">`. Type new props, emits, request/response data and UI state; avoid extending existing `any` usage.
3. Use `@/api` for requests. Extend `PaymentService.ts` or `TeacherScheduleService.ts` when appropriate. Check whether the service returns Axios response data or an inner field before consuming it.
4. Preserve shared token injection and centralized 401 behavior. Do not create a second authentication store or duplicate interceptors.
5. Keep route names, lazy imports, `hideLayout`, `requiresAuth`, `role`, title and description consistent with the target area. Protected UI is not server authorization.
6. Reuse orange/teal theme tokens, Poppins/Quicksand, existing dropdowns, toast and modal conventions. Include responsive layout, labeled controls, keyboard operation, loading, empty and request-error states.
7. Prevent duplicate submissions; refresh affected summaries/tables after successful mutations and preserve existing pagination/search contracts.

## Verify

Run `npm --prefix frontend run type-check` and `npm --prefix frontend run build-only`. Inspect affected pages for the correct role, mobile widths and API failures when a browser is available. Report any browser checks not performed.
