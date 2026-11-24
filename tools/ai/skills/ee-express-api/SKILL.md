---
name: ee-express-api
description: Use when changing English Everywhere backend/src routes, Express controllers, JWT middleware, API contracts or upload endpoints.
---

# English Everywhere Express API

## Entry points

- `backend/src/app.js`: middleware, route mounts, 404 and global errors.
- `backend/src/routes/`: both exported Routers and app-registration factories.
- `backend/src/controllers/`: CommonJS `exports.*` handlers.
- `backend/src/middleware/authJwt.js`: token verification, role helpers and account ownership.
- `frontend/src/api/index.ts`, `frontend/src/services/` and consuming views: actual clients.

## Workflow

1. Locate the mounted URL, HTTP verb, middleware order, handler and all consumers. Register static routes appropriately relative to parameter routes.
2. Inspect the actual response shape. Preserve existing envelopes and pagination when extending endpoints; coordinate necessary contract changes across callers.
3. Validate numeric IDs, limits, required fields, amounts, date ranges and accepted statuses. Reject malformed input with the appropriate 4xx response.
4. Authenticate protected endpoints before role or ownership checks. Resolve user-to-student/teacher associations on the server; do not authorize access using a body/URL ID alone.
5. Inspect authorization helpers critically: existing substring role matching is not a pattern to extend. Use explicit allowed roles for new access decisions.
6. Keep sensitive attributes out of serialized responses and error details. Handle not-found records and expected conflicts distinctly from server failures.
7. For uploads, inspect `uploadRoutes.js` and `uploadController.js`; maintain middleware order, accepted media constraints and URL conventions.
8. For writes spanning several records, load `ee-sequelize-data` and define atomicity and conflict behavior.

## Verify

Run `node --check` on changed backend JavaScript files. Verify valid, invalid, unauthenticated, wrong-role and wrong-owner cases in an isolated environment when available. Do not start the database-syncing server as a syntax check.
