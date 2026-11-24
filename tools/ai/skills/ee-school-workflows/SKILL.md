---
name: ee-school-workflows
description: Use when changing English Everywhere appointments, applicant enrollment, teacher schedules, payment bills or installments, or related admin/student workflows.
---

# English Everywhere School Workflows

Trace each change across the relevant model, controller, route, service and consuming views before coding. Treat the following as verification goals; inspect current implementation to distinguish existing behavior from improvements.

## Appointments and enrollment

Read `programController.js`, `programRoutes.js`, `programScheduleModel.js`, `appointmentBookingModel.js`, `studentController.js` and affected Appointment/ApplicantData views.

- Keep program slots, individual bookings and teaching schedules distinct.
- Inspect available capacity, booking status, approval/rejection/acceptance, unread flags and applicant-to-student conversion.
- Preserve existing field/status names; do not assume acceptance, approval and enrollment are identical.
- Check duplicate submission, slot conflict, capacity changes, cancel/revert and teacher/classroom allocation where affected.
- Verify public booking remains usable while administrative decisions remain server-authorized.

## Teaching schedules

Read `teacherScheduleController.js`, its routes/models, `TeacherScheduleService.ts`, admin Schedules and teacher Schedule views.

- Resolve teacher profile ownership from the account.
- Preserve teacher/program associations and date/time conventions.
- Inspect overlapping schedules and classroom allocation in the actual implementation before adding constraints.

## Payments and installments

Read `paymentController.js`, `paymentRoutes.js`, payment/installment models, `PaymentService.ts`, admin Payments and user Payment views.

- Preserve `Lunas` / `Cicilan` terminology and inspect actual status enums in both models.
- Keep payment IDs distinct from installment IDs; trace `isInstallment` through confirmation and approval.
- Validate positive amounts and total installment consistency, including decimal precision.
- Treat student confirmation (including WhatsApp flow) and admin approval as distinct actions; inspect current transitions before changing them.
- Preserve publish date visibility, deadline/due date behavior, invoice/transaction identifiers and admin summary calculations.
- Check ownership, repeat approvals, parent status after installment updates and atomic parent/child writes.

## Acceptance evidence

Describe the affected role, before/after behavior and request/response contract. Verify the happy path and at least one relevant failure (wrong owner, duplicate, invalid amount, over-capacity or conflicting status) when changing a business rule.
