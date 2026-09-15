// Refresh real metadata for static hosting; retain verified values during outages.
import { readFile, writeFile } from 'node:fs/promises';
import { parseGameConfig } from '../lib/game-config.mjs';
const entries = parseGameConfig(JSON.parse(await readFile('games.json', 'utf8')));
const ids = entries.map(game => game.placeId);
const previous = JSON.parse(await readFile('lib/games-snapshot.json', 'utf8'));
let refreshed = false;
async function json(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (r.ok) return await r.json();
      if (r.status !== 429 && r.status < 500) throw new Error(`HTTP ${r.status}`);
      if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) { if (attempt === 1) throw error; }
  }
  throw new Error('Roblox temporarily unavailable');
}
const games = [];
for (const placeId of ids) {
  const game = { placeId, name: null, image: null, url: `https://www.roblox.com/games/${placeId}`, ...previous.games.find(g => g.placeId === placeId) };
  // Universe mappings are stable; reuse verified IDs to reduce rate limits.
  if (!game.universeId) {
    try { const result = await json(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`); if (result.universeId) game.universeId = result.universeId; }
    catch { console.warn(`Retaining saved data for place ${placeId}`); }
  }
  game.status = entries.find(entry => entry.placeId === placeId).status;
  games.push(game);
}
const universeIds = [...new Set(games.flatMap(g => g.universeId ? [g.universeId] : []))].join(',');
if (universeIds) {
  const [metadata, thumbnails] = await Promise.allSettled([
    json(`https://games.roblox.com/v1/games?universeIds=${universeIds}`),
    json(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeIds}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`),
  ]);
  for (const game of games) {
    const info = metadata.status === 'fulfilled' ? metadata.value.data?.find(x => x.id === game.universeId) : null;
    const name = info?.name;
    if (Number.isSafeInteger(info?.playing) && info.playing >= 0) { game.playing = info.playing; game.playersUpdatedAt = new Date().toISOString(); refreshed = true; }
    if (typeof name === 'string' && name) { game.name = name; refreshed = true; }
    const thumb = thumbnails.status === 'fulfilled' ? thumbnails.value.data?.find(x => x.targetId === game.universeId && x.state === 'Completed') : null;
    if (thumb?.imageUrl) {
      try { const url = new URL(thumb.imageUrl); if (url.protocol === 'https:' && url.hostname.endsWith('.rbxcdn.com')) { game.image = url.href; refreshed = true; } } catch { /* Keep the last verified asset. */ }
    }
  }
}
await writeFile('lib/games-snapshot.json', JSON.stringify({ fetchedAt: refreshed ? new Date().toISOString() : previous.fetchedAt, games }, null, 2) + '\n');
console.log(`${refreshed ? 'Refreshed' : 'Retained saved'} Roblox metadata for ${games.length} experiences.`);
