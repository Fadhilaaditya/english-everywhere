---
name: ee-sequelize-data
description: Use when changing English Everywhere Sequelize models, MySQL queries, associations, schema evolution or transactional multi-record writes.
---

# English Everywhere Sequelize Data

Read `backend/src/models/index.js`, affected `*Model.js`, the corresponding controller, and database configuration without exposing credentials. Inspect installed Sequelize 6 documentation for API-specific changes.

## Data map

- `User` has profile associations `teacherProfile`, `studentProfile`, `adminProfile`.
- `TeacherSchedule` belongs to teacher and program; `ProgramSchedule` belongs to program and has `bookings` of `AppointmentBooking`.
- `Program` uses self-referential `levels` / `parent` and connects to students and payments.
- `Payment` belongs to `student` and `program`, and has `installments` of `PaymentInstallment`.
- Association aliases are part of the API contract; inspect current definitions before constructing includes.

## Workflow

1. Confirm model attribute types, nullability, defaults, foreign keys, aliases and existing response serialization.
2. Keep account IDs and profile IDs separate. Resolve ownership by association.
3. Consider joins and pagination together: multi-row includes can duplicate counts; inspect `distinct`, required joins, filters and sort behavior.
4. For parent/child writes such as payment plus installments, use a transaction and pass it to every participating query. Confirm rollback behavior.
5. For booking capacity or slot allocation, reason about concurrent requests; use a transaction with suitable locking or a conditional update/constraint and handle conflicts.
6. Validate currency precision, dates and status transitions against the actual model. Do not silently change data types or enum values.
7. Inspect repository migration/maintenance practices before proposing schema changes. Describe rollout and compatibility; do not invent an existing migration CLI or run data-changing scripts without the user's request.

## Verify

Use isolated MySQL data for behavior checks. Include failure halfway through multi-record writes, duplicate requests and conflicting bookings when affected. Do not use production data or destructive/altering `sequelize.sync` options.
