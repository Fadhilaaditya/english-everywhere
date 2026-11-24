const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Stub models before loading the routes; this test never opens a database.
const calls = [];
const modelPath = require.resolve('../src/models');
require.cache[modelPath] = {
  id: modelPath, filename: modelPath, loaded: true,
  exports: {
    Sequelize: { Op },
    Program: {}, ProgramSchedule: {},
    AppointmentBooking: { count: async (options) => {
      calls.push(options);
      if (options.include) return 2;
      if (options.where.status === 'PENDING') return 3;
      if (options.where.isRead === false) return 1;
      return 4;
    } },
  },
};
process.env.JWT_SECRET = 'isolated-test-secret';
const app = express();
require('../src/routes/programRoutes')(app);

test('summary requires an exact admin role and returns validated aggregates', async (t) => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => server.close());
  const url = `http://127.0.0.1:${server.address().port}/api/programs/bookings/summary`;
  const token = (role) => jwt.sign({ id: 1, role }, process.env.JWT_SECRET);
  const get = (query, role) => fetch(`${url}${query}`, {
    headers: role ? { Authorization: `Bearer ${token(role)}` } : {},
  });

  assert.equal((await get('?date=2026-11-23')).status, 403);
  assert.equal((await get('?date=2026-11-23', 'student')).status, 403);
  assert.equal((await get('?date=2026-11-23', 'notadmin')).status, 403);
  assert.equal((await get('?date=2026-02-30', 'admin')).status, 400);
  assert.equal(calls.length, 0);
  const response = await get('?date=2026-11-23', 'admin');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    pendingAppointments: 3, unreadApplicants: 1, totalApplicants: 4, scheduledToday: 2,
  });
  assert.deepEqual(calls[2].where.status[Op.in], ['ACCEPTED', 'BOOKED']);
  assert.equal(calls[3].include[0].as, 'schedule');
  assert.equal(calls[3].include[0].where.date, '2026-11-23');
  assert.equal((await get('?date=2026-11-23', 'superadmin')).status, 200);
});
