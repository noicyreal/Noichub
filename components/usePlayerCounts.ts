'use client';
import { useEffect, useState } from 'react';
import type { Game } from '@/lib/constants';
import { PLAYER_COUNTS_ENDPOINT, PLAYER_REFRESH_MS, parsePlayerCounts, savedPlayerCounts, type PlayerCounts } from '@/lib/player-counts';

export function usePlayerCounts(games: Game[]) {
  const [counts, setCounts] = useState<PlayerCounts>(() => savedPlayerCounts(games));
  const [status, setStatus] = useState<'connecting' | 'live' | 'partial' | 'stale'>('connecting');
  const ids = [...new Set(games.flatMap(game => game.universeId ? [game.universeId] : []))].join(',');

  useEffect(() => {
    const universeIds = ids.split(',').filter(Boolean).map(Number);
    if (!universeIds.length) return;
    let disposed = false;
    let inFlight = false;
    let lastAttempt = 0;
    let failures = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    const markStale = (previous: PlayerCounts): PlayerCounts => Object.fromEntries(
      Object.entries(previous).map(([id, count]) => [id, { ...count, live: false }]),
    );

    async function refresh() {
      if (disposed || inFlight || document.hidden) return;
      clearTimeout(timer);
      inFlight = true;
      lastAttempt = Date.now();
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 10_000);
      let retryAfter = 0;
      try {
        const response = await fetch(`${PLAYER_COUNTS_ENDPOINT}?universeIds=${ids}`, {
          signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer',
        });
        if (!response.ok) {
          retryAfter = Math.min(Math.max(Number(response.headers.get('retry-after')) || 0, 0) * 1000, 300_000);
          throw new Error(`Player counts returned ${response.status}`);
        }
        const next = parsePlayerCounts(await response.json(), universeIds, new Date().toISOString());
        if (disposed) return;
        setCounts(previous => ({ ...markStale(previous), ...next }));
        setStatus(Object.keys(next).length === universeIds.length ? 'live' : 'partial');
        failures = 0;
      } catch {
        if (disposed) return;
        setCounts(markStale);
        setStatus('stale');
        failures += 1;
      } finally {
        clearTimeout(timeout);
        inFlight = false;
        if (!disposed) timer = setTimeout(refresh, Math.max(retryAfter, Math.min(PLAYER_REFRESH_MS * 2 ** failures, 300_000)));
      }
    }
    function onVisibilityChange() {
      if (!document.hidden) {
        const remaining = PLAYER_REFRESH_MS - (Date.now() - lastAttempt);
        if (remaining <= 0) void refresh();
        else { clearTimeout(timer); timer = setTimeout(refresh, remaining); }
      }
    }
    void refresh();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      disposed = true;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [ids]);

  return { counts, status: ids ? status : 'stale' as const };
}
