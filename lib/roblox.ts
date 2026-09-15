import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { PLACE_IDS, GAME_STATUSES, type Game } from './constants';
import snapshot from './games-snapshot.json';

async function getJson<T>(url: string): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(url, { signal: AbortSignal.timeout(6000), next: { revalidate: 3600 } });
    if (response.ok) return response.json() as Promise<T>;
    if (attempt === 0 && (response.status === 429 || response.status >= 500)) {
      const delay = Math.min(Number(response.headers.get('retry-after')) || 1, 2);
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
      continue;
    }
    throw new Error(`Roblox API returned ${response.status}`);
  }
  throw new Error('Roblox API unavailable');
}
const fetchGames = unstable_cache(async (): Promise<Game[]> => {
  const saved = snapshot.games as Game[];
  const games: Game[] = [];
  // Small batches avoid overwhelming the public place-to-universe endpoint.
  for (let i = 0; i < PLACE_IDS.length; i += 4) {
    games.push(...await Promise.all(PLACE_IDS.slice(i, i + 4).map(async placeId => {
      const previous = saved.find(g => g.placeId === placeId);
      const game: Game = { placeId, name: null, image: null, url: `https://www.roblox.com/games/${placeId}`, ...previous, status: GAME_STATUSES[placeId] };
      try {
        const result = await getJson<{ universeId?: number }>(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
        if (result.universeId) game.universeId = result.universeId;
      } catch { /* Retain previously verified metadata during upstream failures. */ }
      return game;
    })));
  }
  const ids = [...new Set(games.flatMap(g => g.universeId ? [g.universeId] : []))].join(',');
  if (!ids) return games;
  const [metadata, thumbnails] = await Promise.allSettled([
    getJson<{ data: { id: number; name: string; playing: number }[] }>(`https://games.roblox.com/v1/games?universeIds=${ids}`),
    getJson<{ data: { targetId: number; state: string; imageUrl: string }[] }>(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`),
  ]);
  return games.map(game => {
    const info = metadata.status === 'fulfilled' ? metadata.value.data?.find(item => item.id === game.universeId) : null;
    const icon = thumbnails.status === 'fulfilled' ? thumbnails.value.data?.find(item => item.targetId === game.universeId && item.state === 'Completed') : null;
    let image = game.image;
    if (icon?.imageUrl) {
      try { const url = new URL(icon.imageUrl); if (url.protocol === 'https:' && url.hostname.endsWith('.rbxcdn.com')) image = url.href; } catch { /* Invalid upstream asset gets the saved fallback. */ }
    }
    return { ...game, name: info?.name ?? game.name, image,
      ...(Number.isSafeInteger(info?.playing) && info!.playing >= 0 ? { playing: info!.playing, playersUpdatedAt: new Date().toISOString() } : {}),
    };
  });
}, ['noichub-roblox-games-v2', JSON.stringify(GAME_STATUSES)], { revalidate: 3600 });
export const getGames = cache(async (): Promise<Game[]> => {
  // Pages has no server: its workflow refreshes the verified snapshot before export.
  if (process.env.GITHUB_PAGES === 'true') return PLACE_IDS.map(placeId => ({
    placeId, name: null, image: null, url: `https://www.roblox.com/games/${placeId}`,
    ...(snapshot.games as Game[]).find(game => game.placeId === placeId),
    status: GAME_STATUSES[placeId],
  }));
  return fetchGames();
});
