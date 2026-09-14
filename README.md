# NoicHub

A responsive Next.js + TypeScript website for NoicHub, with Framer Motion, Lucide icons, local fonts, and the actual supplied GUI screenshots. Styling uses custom responsive CSS in `app/globals.css`.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

## GitHub Pages (configured)

The connected repository is `noicyreal/Noichub`, so the public project URL is **https://noicyreal.github.io/Noichub/**. The name `noichub.github.io` requires ownership of a GitHub account or organization named `noichub` and its matching `noichub.github.io` repository.

`.github/workflows/pages.yml` builds and publishes the static site on pushes to `main`, manual runs, and a daily schedule. In repository **Settings → Pages**, use **GitHub Actions** as the source. The workflow derives the domain and repository subpath from GitHub Pages, refreshes Roblox names and thumbnail URLs, builds `out/`, and deploys that artifact. No API key or external web server is required. API outages retain the saved verified metadata.

The Pages build uses static export, pre-rendered game data, local fonts/images, and repository-aware asset and social-image paths. `/api/games/` is an exported JSON file. Game metadata updates on each deployment (daily by default), rather than via a server on each visit. GitHub can suspend scheduled runs after prolonged repository inactivity; pushing a change or running the workflow manually refreshes the site.

To build and preview the same deployment locally:

```sh
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/Noichub NEXT_PUBLIC_SITE_URL=https://noicyreal.github.io npm run build
node scripts/serve-pages.mjs
# Open http://127.0.0.1:3100/Noichub/
```

To test the static export:

```sh
npx playwright install chromium
npx playwright test --config playwright.pages.config.ts
```

## Optional Node hosting

Standard Next.js server hosting is still supported:

```sh
cp .env.example .env.local
# Set NEXT_PUBLIC_SITE_URL to the deployed HTTPS origin.
npm run build
npm start
```

Leave `GITHUB_PAGES` and `NEXT_PUBLIC_BASE_PATH` unset for a normal root-domain server deployment. On this deployment, metadata can refresh through the server-side cache. Set the public URL before building for absolute social metadata.

## Real game data

`lib/roblox.ts` resolves the eleven original place IDs through `apis.roblox.com/universes/v1/places/{placeId}/universe`, fetches real experience names from `games.roblox.com/v1/games`, and fetches icons from `thumbnails.roblox.com/v1/games/icons`. The server batches requests, deduplicates universe IDs, times out requests, retries HTTP 429/5xx once, and caches results for one hour. React request deduplication prevents repeated work within a render. `/api/games` exposes the same cached results without browser CORS issues.

`lib/games-snapshot.json` is verified API data fetched during development, not hand-authored names or images. It preserves usable game cards during Roblox outages. If no verified name is available, a card shows its original place ID; unavailable thumbnails get a neutral game icon. Roblox CDN images are served directly from API-returned URLs, at 512×512, with native lazy loading and fixed aspect ratios. The Node-hosted homepage is prerendered with cached metadata; GitHub Pages refreshes at deployment time.

To update the saved snapshot (requires outbound network access):

```sh
node scripts/refresh-games.mjs
```

## Screenshots and assets

All three supplied screenshots were downloaded successfully and are served locally:

- `public/images/showcase/noichub-1.webp` — Defusal (1299×731)
- `public/images/showcase/noichub-2.webp` — Riotfall (717×649)
- `public/images/showcase/noichub-3.webp` — Frontlines (751×713)

Replace these files to update screenshots; update dimensions and labels in `lib/constants.ts` if needed. The original aspect ratios are preserved. Next.js optimizes them, and the hero image is preloaded. The lightbox uses a native modal dialog for focus trapping, Escape dismissal, keyboard slide navigation, and focus restoration. Locally hosted DM Sans and Space Grotesk fonts and their OFL licenses are in `public/fonts/`.

The exact loader in `lib/constants.ts` is only displayed and copied. The site never fetches or executes it. Existing `loader.luau` is independent of the website.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

Playwright starts the production server. Build before testing. The suite checks the exact clipboard contents and denied-permission fallback, game search, modal keyboard/focus behavior, image fallbacks, all eleven destination URLs, Discord links, local screenshots, real API metadata, and overflow at 320, 375, 768, 1024, 1440, and 1920 pixels. The real image/API checks need outbound network access. Screenshots are saved under `test-results/`.

If browser binaries are installed in a custom path, run tests with the same `PLAYWRIGHT_BROWSERS_PATH` environment variable used during installation.
