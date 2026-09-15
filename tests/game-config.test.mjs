import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseGameConfig, parsePlaceId } from '../lib/game-config.mjs';

test('config accepts both statuses and rejects unsafe or invalid values', () => {
  assert.deepEqual(parseGameConfig({ '123': 'patched', '456': 'undetected' }), [{ placeId: '123', status: 'patched' }, { placeId: '456', status: 'undetected' }]);
  for (const input of [[], {}, null, { '123': 'detected' }, { 'abc': 'patched' }, { '9007199254740992': 'patched' }]) assert.throws(() => parseGameConfig(input));
  assert.equal(parsePlaceId('https://www.roblox.com/games/79393329652220/Defusal'), '79393329652220');
  assert.throws(() => parsePlaceId('https://example.com/games/123'));
});

test('management CLI adds, changes, removes, and preserves config on errors', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'noichub-config-test-'));
  const script = resolve('scripts/manage-games.mjs');
  const path = join(dir, 'games.json');
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { cwd: dir, encoding: 'utf8' });
  try {
    await writeFile(path, JSON.stringify({ '111': 'undetected' }));
    assert.equal(run('add', 'https://www.roblox.com/games/222/Test').status, 0);
    assert.equal(JSON.parse(await readFile(path, 'utf8'))['222'], 'undetected');
    assert.equal(run('status', '222', 'patched').status, 0);
    assert.equal(JSON.parse(await readFile(path, 'utf8'))['222'], 'patched');
    const before = await readFile(path, 'utf8');
    assert.equal(run('status', '222', 'invalid').status, 1);
    assert.equal(await readFile(path, 'utf8'), before);
    assert.equal(run('add', '222').status, 1);
    assert.equal(run('remove', '222').status, 0);
    assert.deepEqual(JSON.parse(await readFile(path, 'utf8')), { '111': 'undetected' });
  } finally { await rm(dir, { recursive: true, force: true }); }
});
