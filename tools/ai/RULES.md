# English Everywhere — Project Rules

## Communication and scope

- Respond in Indonesian unless the user requests another language. Preserve existing UI terminology.
- Inspect the relevant implementation before editing. Keep changes focused and preserve unrelated work.
- Do not commit, push, deploy, or run data-changing maintenance scripts unless requested.
- Use project skills for the affected area. Delegate only when the user requests delegation or concurrent work.

## Repository map

- `frontend/`: Vue 3 Composition API, TypeScript, Vite 7, Vue Router 4, Tailwind CSS 4.
- `frontend/src/views/user/`: public website and student-facing pages, including appointment, payment and profile.
- `frontend/src/views/admin/`: applicants, accounts, schedules, appointments, payments, articles and events.
- `frontend/src/views/teacher/`: teacher layout, schedule and learning materials.
- `frontend/src/api/index.ts`: shared Axios client; `VITE_API_URL`, bearer token injection and 401 handling.
- `frontend/src/services/`: existing payment and teacher-schedule API abstractions.
- `backend/`: CommonJS JavaScript, Express 5, Sequelize 6, MySQL via mysql2, JWT, bcryptjs, Multer and Cloudinary.
- `backend/src/app.js`: route registration and global error handling. Routes use both Router exports and `(app)` factories; follow the affected module.
- `backend/src/models/index.js`: model registry and association aliases.
- `.cpanel.yml`: deployment copies backend and prebuilt `frontend/dist` to cPanel.
- `tools/ai/`: editable AI configuration source; regenerate instead of editing generated outputs.

## Implementation conventions

- Follow adjacent Vue SFCs using `<script setup lang="ts">`, `@/` imports and feature-local `_components/`.
- Reuse the shared Axios client. Inspect each endpoint's actual response: the API has mixed envelopes, including `data`, arrays and paginated `payments`.
- Keep frontend TypeScript and backend CommonJS distinct. Do not introduce React, Next.js, Prisma, Pinia or a new framework without a requirement.
- Reuse Tailwind 4 tokens in `frontend/src/assets/main.css`: orange primary, teal secondary, Poppins body, Quicksand headings.
- Trace cross-layer changes through component → API/service → route → controller → model. Preserve consumers when changing payloads.
- Validate IDs, enums, pagination, dates and monetary values at the API boundary. Check authorization and ownership on the server; router guards and localStorage roles are only client UX.
- Roles include `student`, legacy frontend `user`, `teacher`, `admin`, `superadmin`. Inspect the actual token/role handling before changing access.
- Keep `TeacherSchedule` (teaching), `ProgramSchedule` (course/appointment slots) and `AppointmentBooking` (bookings) distinct.
- Keep `User.id`, `Student.id` and `Teacher.id` distinct. Resolve profile ownership through associations rather than assuming equal IDs.
- Treat existing code as evidence, not proof of correctness. Report relevant access-control or data-integrity defects rather than copying them blindly.
- Do not expose secrets, tokens, passwords, or personal data in code, logs or examples. Use placeholders in configuration.

## Verification

- Frontend: `npm --prefix frontend run type-check` and `npm --prefix frontend run build-only` for applicable changes.
- Lint without automatic edits: run `npx eslint .` from `frontend/`. The existing `lint` script has `--fix`; use it only when deliberate.
- Backend: run `node --check <changed-file.js>`; add focused behavioral verification for changed business rules when practical.
- `npm --prefix backend test` is a failing placeholder, not an existing test suite.
- Do not start `backend/server.js` merely for syntax verification: startup authenticates and calls `sequelize.sync()` on the configured database.
- Use an isolated database for integration checks. Do not add `sync({ force: true })` or `sync({ alter: true })` as a migration shortcut.
- Report commands actually executed, results and any checks blocked by missing dependencies or services. Do not claim unrun tests passed.
