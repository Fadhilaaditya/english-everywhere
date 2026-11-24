import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { generate } from './sync-config.mjs';

const sourceDirectory = dirname(fileURLToPath(import.meta.url));

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'ee-ai-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = join(root, 'tools/ai');
  await cp(sourceDirectory, source, { recursive: true });
  return { root, source };
}

test('generates real catalog, checks drift and is idempotent', async (t) => {
  const options = await fixture(t);
  await assert.rejects(generate({ ...options, check: true }), /belum sinkron/);
  const first = await generate(options);
  assert.equal(first.changed.length, 14);
  assert.deepEqual((await generate(options)).changed, []);
  await generate({ ...options, check: true });
  const config = JSON.parse(await readFile(join(options.root, 'opencode.json'), 'utf8'));
  assert.equal(config.default_agent, 'ee-fullstack');
  assert.match(await readFile(join(options.root, '.opencode/skills/ee-school-workflows/SKILL.md'), 'utf8'), /Cicilan/);
});

test('updates changed sources and removes only unchanged stale managed files', async (t) => {
  const options = await fixture(t);
  await generate(options);
  const path = join(options.source, 'agents/ee-frontend.md');
  await writeFile(path, `${await readFile(path, 'utf8')}\nUpdated instructions.\n`);
  await rm(join(options.source, 'commands/ee-feature.md'));
  const custom = join(options.root, '.opencode/agents/custom.md');
  await writeFile(custom, 'User-owned agent');
  await assert.rejects(generate({ ...options, check: true }), /belum sinkron/);
  await generate(options);
  assert.equal(await readFile(custom, 'utf8'), 'User-owned agent');
  await assert.rejects(readFile(join(options.root, '.opencode/commands/ee-feature.md')), { code: 'ENOENT' });
  await generate({ ...options, check: true });
});

test('refuses unmanaged config without writing generated agents', async (t) => {
  const options = await fixture(t);
  await writeFile(join(options.root, 'opencode.json'), '{"model":"user/model"}');
  await assert.rejects(generate(options), /di luar kendali/);
  assert.equal(await readFile(join(options.root, 'opencode.json'), 'utf8'), '{"model":"user/model"}');
  await assert.rejects(readFile(join(options.root, '.opencode/agents/ee-fullstack.md')), { code: 'ENOENT' });
});

test('preserves manual edits even when the source agent was deleted', async (t) => {
  const options = await fixture(t);
  await generate(options);
  const output = join(options.root, '.opencode/agents/ee-backend.md');
  await writeFile(output, 'Manual edits');
  await rm(join(options.source, 'agents/ee-backend.md'));
  await assert.rejects(generate(options), /diedit manual/);
  assert.equal(await readFile(output, 'utf8'), 'Manual edits');
});

test('rejects mismatched skill metadata before writing', async (t) => {
  const options = await fixture(t);
  const path = join(options.source, 'skills/ee-verification/SKILL.md');
  await writeFile(path, (await readFile(path, 'utf8')).replace('name: ee-verification', 'name: wrong'));
  await assert.rejects(generate(options), /Nama skill/);
});

test('rejects symlinked output directories', async (t) => {
  const options = await fixture(t);
  await symlink(options.source, join(options.root, '.opencode'), 'dir');
  await assert.rejects(generate(options), /Symlink/);
});
