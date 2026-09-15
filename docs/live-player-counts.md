# Player counts and execution milestone

Game cards refresh public Roblox concurrent-player counts every 60 seconds and default to most players first. This is the player count of the whole Roblox experience, not a count of NoicHub users. Visitors can also choose name order or the original list. Unknown counts sort after known counts; zero is a valid count.

GitHub Pages cannot run a live API server, and Roblox's games API does not supply browser CORS headers. The browser therefore reads the public `playing` field through `https://games.roproxy.com/v1/games`, a third-party public Roblox API relay with CORS support. Only the supported universe IDs are sent; cookies, user identifiers, and credentials are omitted. It uses one batched request per minute while the tab is visible, a ten-second timeout, and an increasing retry delay capped at five minutes. Invalid counts and unrelated universe IDs are ignored.

On API errors, cards retain their last known numbers and label them accordingly. Official Roblox counts fetched during the Pages build provide a timestamped initial fallback. Each successful refresh updates the individual count timestamp. The relay is an external availability dependency; `lib/player-counts.ts` contains its endpoint if a self-hosted replacement becomes available.

The **30,000+ script executions** hero statistic is a fixed milestone confirmed by the project owner. It is not calculated from visits, script copies, or Roblox player counts, and no loader telemetry was added.

Tests in `tests/pages.spec.ts` verify the Pages subpath, live sorting, a legitimate zero count, alternate ordering, search, mobile overflow, failure fallback, timed refresh, and invalid/partial upstream data. Run after a Pages export:

```sh
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/Noichub NEXT_PUBLIC_SITE_URL=https://noicyreal.github.io npm run build
npx playwright test --config playwright.pages.config.ts
```
