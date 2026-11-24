const test = require('node:test');
const assert = require('node:assert/strict');
const { Op, Transaction } = require('sequelize');

// In-memory transaction/lock simulation: no real database or application startup.
let bookings = [];
let failCreate = false;
let lockQueue = Promise.resolve();
const calls = [];
const modelPath = require.resolve('../src/models');
require.cache[modelPath] = {
  id: modelPath, filename: modelPath, loaded: true,
  exports: {
    Sequelize: { Op, Transaction },
    Program: {},
    ProgramSchedule: {
      findByPk: async (id, options) => {
        calls.push(options);
        return id === 1 ? { maxSlots: 1 } : null;
      },
    },
    AppointmentBooking: {
      count: async ({ where }) => bookings.filter((item) => item.scheduleId === where.scheduleId && item.status !== 'REJECTED').length,
      create: async (data) => {
        if (failCreate) throw new Error('simulated write failure');
        bookings.push(data);
        return data;
      },
    },
    sequelize: {
      transaction: async (options, callback) => {
        assert.equal(options.isolationLevel, Transaction.ISOLATION_LEVELS.READ_COMMITTED);
        let release;
        const previous = lockQueue;
        lockQueue = new Promise((resolve) => { release = resolve; });
        await previous;
        try { return await callback({ LOCK: { UPDATE: 'UPDATE' } }); }
        finally { release(); }
      },
    },
  },
};
const { bookAppointment } = require('../src/controllers/programController');

function submit(id, name = 'Test applicant') {
  const result = { status: 200, body: null };
  const res = {
    status(code) { result.status = code; return this; },
    send(body) { result.body = body; return this; },
  };
  return bookAppointment({ params: { scheduleId: id }, body: { applicantName: name } }, res).then(() => result);
}

test('validates inputs, serializes competing registrations, and handles failures', async () => {
  assert.equal((await submit('1x')).status, 400);
  assert.equal((await submit('1', '  ')).status, 400);
  assert.equal((await submit('2')).status, 404);
  const results = await Promise.all([submit('1'), submit('1')]);
  assert.deepEqual(results.map((result) => result.status).sort(), [201, 400]);
  assert.equal(bookings.length, 1);
  assert.equal(calls[0].lock, 'UPDATE');
  bookings = [];
  failCreate = true;
  assert.equal((await submit('1')).status, 500);
  assert.equal(bookings.length, 0);
  failCreate = false;
  bookings = [{ scheduleId: 1, status: 'REJECTED' }];
  assert.equal((await submit('1')).status, 201);
});
