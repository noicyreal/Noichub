import type { Game } from './constants';

// RoProxy supplies CORS headers that the official Roblox endpoint does not.
// Only public universe IDs are sent; no cookies, user IDs, or credentials.
export const PLAYER_COUNTS_ENDPOINT = 'https://games.roproxy.com/v1/games';
export const PLAYER_REFRESH_MS = 60_000;
export type PlayerCount = { playing: number; updatedAt: string | null; live: boolean };
export type PlayerCounts = Record<string, PlayerCount>;
export type GameSort = 'players' | 'name' | 'original';

export function savedPlayerCounts(games: Game[]): PlayerCounts {
  return Object.fromEntries(games.flatMap(game =>
    game.universeId && Number.isSafeInteger(game.playing) && (game.playing ?? -1) >= 0
      ? [[String(game.universeId), { playing: game.playing!, updatedAt: game.playersUpdatedAt ?? null, live: false }]]
      : [],
  ));
}

export function parsePlayerCounts(payload: unknown, allowedIds: number[], now: string): PlayerCounts {
  if (!payload || typeof payload !== 'object' || !('data' in payload) || !Array.isArray(payload.data)) {
    throw new Error('Invalid player-count response');
  }
  const allowed = new Set(allowedIds);
  const counts: PlayerCounts = {};
  for (const item of payload.data) {
    if (!item || typeof item !== 'object') continue;
    if (allowed.has(item.id) && Number.isSafeInteger(item.playing) && item.playing >= 0) {
      counts[String(item.id)] = { playing: item.playing, updatedAt: now, live: true };
    }
  }
  if (Object.keys(counts).length === 0) throw new Error('No valid player counts');
  return counts;
}

export function sortGames(games: Game[], counts: PlayerCounts, sort: GameSort): Game[] {
  if (sort === 'original') return [...games];
  return [...games].sort((a, b) => {
    if (sort === 'players') {
      const difference = (counts[String(b.universeId)]?.playing ?? -1) - (counts[String(a.universeId)]?.playing ?? -1);
      if (difference !== 0) return difference;
    }
    return (a.name ?? a.placeId).localeCompare(b.name ?? b.placeId, 'en');
  });
}
