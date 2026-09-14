// Refresh real metadata for static hosting; retain verified values during outages.
import { readFile, writeFile } from 'node:fs/promises';
const ids = ['79393329652220','120189115846709','7796842481','76822114837453','110808833601416','5938036553','132640332499066','574407221','139988436996662','129870876180628','17738127017'];
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
  games.push(game);
}
const universeIds = [...new Set(games.flatMap(g => g.universeId ? [g.universeId] : []))].join(',');
if (universeIds) {
  const [metadata, thumbnails] = await Promise.allSettled([
    json(`https://games.roblox.com/v1/games?universeIds=${universeIds}`),
    json(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeIds}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`),
  ]);
  for (const game of games) {
    const name = metadata.status === 'fulfilled' ? metadata.value.data?.find(x => x.id === game.universeId)?.name : null;
    if (typeof name === 'string' && name) { game.name = name; refreshed = true; }
    const thumb = thumbnails.status === 'fulfilled' ? thumbnails.value.data?.find(x => x.targetId === game.universeId && x.state === 'Completed') : null;
    if (thumb?.imageUrl) {
      try { const url = new URL(thumb.imageUrl); if (url.protocol === 'https:' && url.hostname.endsWith('.rbxcdn.com')) { game.image = url.href; refreshed = true; } } catch { /* Keep the last verified asset. */ }
    }
  }
}
await writeFile('lib/games-snapshot.json', JSON.stringify({ fetchedAt: refreshed ? new Date().toISOString() : previous.fetchedAt, games }, null, 2) + '\n');
console.log(`${refreshed ? 'Refreshed' : 'Retained saved'} Roblox metadata for ${games.length} experiences.`);
