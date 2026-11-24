---
name: ee-verification
description: Use when testing, reviewing readiness or verifying English Everywhere changes, including frontend type/build checks, backend syntax, role access and cPanel deployment compatibility.
---

# English Everywhere Verification

## Select checks by changed area

| Area | Check |
| --- | --- |
| Vue/TypeScript | `npm --prefix frontend run type-check` |
| Frontend bundling | `npm --prefix frontend run build-only` |
| Frontend lint | From `frontend/`, `npx eslint .` (without auto-fix) |
| Backend JavaScript | `node --check <changed-file.js>` |
| AI tooling | `npm --prefix tools/ai test` then `npm --prefix tools/ai run check` |

Read package scripts first in case they have changed. Dependencies must be installed in their respective package directories. There is no root app package script. The backend `test` script is a failing placeholder.

## Business and access checks

- API contract: correct URL/verb, envelope, pagination, validation and not-found behavior.
- Roles: public, unauthenticated, student, teacher, admin and superadmin as relevant; include wrong-owner access.
- Appointments: availability, duplicate booking, rejection/revert and capacity conflict as relevant.
- Payments: Lunas/Cicilan, amount totals, future publish dates, confirmation versus approval, repeated approval and aggregate status.
- UI: loading/error/empty state, modal/form interaction, mobile layout and existing sidebar/teacher layout.

Use isolated data/services. Starting `backend/server.js` connects and synchronizes models; syntax checks must not start it. Add focused behavior tests for substantial logic changes when practical, without inventing an existing test framework.

## Deployment compatibility

Read `.cpanel.yml` for deployment-related changes. It copies prebuilt `frontend/dist`; verify build output, Vite base/API URL, SPA deep links and backend upload paths when affected. Build success does not prove cPanel deployment. Do not deploy without a request.

## Result format

Report command, result and relevant error location. Separate checks executed from manual scenarios proposed, and existing failures from regressions supported by evidence. Mention missing services/dependencies as blockers rather than claiming success.
