import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const manifestPath = '.opencode/.tools-ai-manifest.json';
const digest = (content) => createHash('sha256').update(content).digest('hex');
const managedPath = (path) => path === 'opencode.json'
  || /^\.opencode\/(agents|commands|skills)\/[a-zA-Z0-9_./-]+$/.test(path)
    && !path.split('/').includes('..');

async function optionalRead(path) {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function assertNoSymlinks(root, path) {
  let current = root;
  for (const part of path.split('/')) {
    current = join(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink()) {
        throw new Error(`Symlink tidak didukung pada output: ${path}`);
      }
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
  }
}

async function collect(directory, prefix = '') {
  const files = new Map();
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      for (const item of await collect(join(directory, entry.name), relative)) files.set(...item);
    } else if (entry.isFile()) {
      files.set(relative, await readFile(join(directory, entry.name), 'utf8'));
    } else {
      throw new Error(`Sumber harus file/direktori biasa: ${relative}`);
    }
  }
  return files;
}

export async function generate({ root = resolve(sourceDirectory, '../..'), source = sourceDirectory, check = false } = {}) {
  const config = JSON.parse(await readFile(join(source, 'opencode.json'), 'utf8'));
  if (config.$schema !== 'https://opencode.ai/config.json') throw new Error('$schema OpenCode wajib diisi.');
  for (const instruction of config.instructions ?? []) {
    await readFile(resolve(root, instruction), 'utf8');
  }
  const expected = new Map([['opencode.json', `${JSON.stringify(config, null, 2)}\n`]]);
  for (const category of ['agents', 'commands', 'skills']) {
    const files = await collect(join(source, category));
    for (const [relative, content] of files) {
      const output = `.opencode/${category}/${relative}`;
      if (!managedPath(output)) throw new Error(`Nama output tidak valid: ${output}`);
      if (relative.endsWith('.md')) {
        if (!/^---\r?\n[\s\S]+?\r?\n---\r?\n\s*\S/.test(content)
          || !/^description: .+$/m.test(content)) {
          throw new Error(`Frontmatter/body tidak lengkap: ${category}/${relative}`);
        }
        if (category === 'skills' && relative.endsWith('/SKILL.md')) {
          const name = relative.split('/').at(-2);
          if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64
            || !content.includes(`\nname: ${name}\n`)) {
            throw new Error(`Nama skill harus cocok dengan direktori: ${relative}`);
          }
        }
      }
      expected.set(output, content);
    }
  }
  if (!expected.has(`.opencode/agents/${config.default_agent}.md`)) {
    throw new Error('default_agent harus memiliki file agent sumber.');
  }
  await assertNoSymlinks(root, manifestPath);
  const previous = JSON.parse(await optionalRead(join(root, manifestPath)) ?? '{"version":1,"files":{}}');
  if (previous.version !== 1 || !previous.files || typeof previous.files !== 'object'
    || Array.isArray(previous.files) || Object.keys(previous.files).some((path) => !managedPath(path))) {
    throw new Error('Manifest generator tidak valid.');
  }
  const paths = new Set([...expected.keys(), ...Object.keys(previous.files)]);
  const changed = [];
  // Preflight every output before writing anything, including stale outputs.
  for (const path of paths) {
    await assertNoSymlinks(root, path);
    const current = await optionalRead(join(root, path));
    if (current !== null && (!previous.files[path] || digest(current) !== previous.files[path])) {
      throw new Error(`File di luar kendali generator atau diedit manual: ${path}. Pindahkan perubahan ke tools/ai sebelum generate.`);
    }
    if (current !== (expected.get(path) ?? null)) changed.push(path);
  }
  const manifest = `${JSON.stringify({ version: 1, files: Object.fromEntries(
    [...expected].map(([path, content]) => [path, digest(content)]),
  ) }, null, 2)}\n`;
  if (check) {
    if (changed.length || await optionalRead(join(root, manifestPath)) !== manifest) {
      throw new Error(`Hasil generate belum sinkron: ${changed.join(', ') || manifestPath}. Jalankan npm --prefix tools/ai run generate.`);
    }
    return { changed: [] };
  }
  for (const path of changed) {
    if (expected.has(path)) {
      await mkdir(dirname(join(root, path)), { recursive: true });
      await writeFile(join(root, path), expected.get(path));
    } else {
      await rm(join(root, path));
    }
  }
  await mkdir(join(root, '.opencode'), { recursive: true });
  await writeFile(join(root, manifestPath), manifest);
  return { changed };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.slice(2).some((arg) => arg !== '--check')) throw new Error('Argumen yang tersedia: --check');
    const check = process.argv.includes('--check');
    const result = await generate({ check });
    console.log(check ? 'Konfigurasi AI sinkron.' : `Konfigurasi AI siap (${result.changed.length} file diperbarui). Restart OpenCode untuk memuat perubahan.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
