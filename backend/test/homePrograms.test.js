const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { Op } = require('sequelize');

const calls = [];
let fail = false;
const modelPath = require.resolve('../src/models');
require.cache[modelPath] = {
  id: modelPath, filename: modelPath, loaded: true,
  exports: {
    Sequelize: { Op },
    Program: { findAll: async (options) => {
      calls.push(options);
      if (fail) throw new Error('simulated database failure');
      return [{ id: 1, title: 'Sample', desc: null, image: null, category: 'REGULAR' }];
    } },
    ProgramSchedule: {},
  },
};
const app = express();
require('../src/routes/programRoutes')(app);

test('home endpoint returns only card fields and preserves existing list contract', async (t) => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}/api/programs`;
  const home = await fetch(`${base}/home`);
  assert.equal(home.status, 200);
  assert.equal((await home.json())[0].title, 'Sample');
  assert.deepEqual(calls[0], {
    where: { parentId: null },
    attributes: ['id', 'title', 'desc', 'image', 'category'],
  });
  assert.equal((await fetch(base)).status, 200);
  assert.deepEqual(calls[1].include, ['levels']);
  fail = true;
  const error = await fetch(`${base}/home`);
  assert.equal(error.status, 500);
  assert.deepEqual(await error.json(), { message: 'Gagal mengambil data program.' });
});
