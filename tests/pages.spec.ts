import { test, expect } from '@playwright/test';
import snapshot from '../lib/games-snapshot.json';
import { LOADER, PLACE_IDS, type Game } from '../lib/constants';
test('Pages export works with a repository subpath and no server runtime', async ({ page, context, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.url().startsWith('http://127.0.0.1:3100') && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  // Stabilize the deliberately floating hero for coordinate-based automation.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/Noichub/');
  await expect(page).toHaveTitle('NoicHub — Roblox Lua Hub');
  await expect(page.getByLabel('Script status: Undetected', { exact: true })).toHaveCount(PLACE_IDS.length);
  await expect(page.locator('.game-card')).toHaveCount(PLACE_IDS.length);
  await expect(page.locator('.player-status')).toContainText('Live Roblox players', { timeout: 20000 });
  await expect(page.locator('.hero-preview-button img')).toHaveAttribute('src', '/Noichub/images/showcase/noichub-1.webp');
  await expect.poll(() => page.locator('.hero-preview-button img').evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toBe('https://noicyreal.github.io/Noichub/images/showcase/noichub-1.webp');
  await page.getByRole('button', { name: 'Copy script', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(LOADER);
  await page.getByRole('button', { name: 'Enlarge NoicHub preview' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  const api = await request.get('/Noichub/api/games/');
  expect(api.ok()).toBe(true);
  expect((await api.json()).games).toHaveLength(PLACE_IDS.length);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.locator('#mobile-menu').getByRole('link', { name: 'Games', exact: true }).click();
  await expect(page).toHaveURL(/\/Noichub\/#games$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('live counts rank games, keep zero players, and support other sort orders', async ({ page }) => {
  const games = snapshot.games as Game[];
  await page.route('https://games.roproxy.com/v1/games?*', route => route.fulfill({
    json: { data: games.map((game, index) => ({ id: game.universeId, playing: index === 3 ? 987654 : index === 0 ? 0 : 100 - index })) },
  }));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/Noichub/');
  await expect(page.locator('.player-status')).toContainText('Live Roblox players');
  await expect(page.locator('.game-card').first()).toHaveAttribute('href', games[3].url);
  await expect(page.locator('.game-players').filter({ hasText: '987,654 playing now' })).toHaveCount(1);
  await expect(page.locator('.game-players').filter({ hasText: /^0 playing now$/ })).toHaveCount(1);
  await expect(page.getByText('30,000+', { exact: true })).toBeVisible();
  await page.getByLabel('Sort supported games').selectOption('original');
  await expect(page.locator('.game-card').first()).toHaveAttribute('href', games[0].url);
  await page.getByLabel('Sort supported games').selectOption('name');
  const names = await page.locator('.game-info h3').allTextContents();
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en')));
  await page.getByRole('searchbox').fill('Frontlines');
  await expect(page.locator('.game-card')).toHaveCount(1);
  await expect(page.locator('.game-players')).toContainText('playing now');
  await page.setViewportSize({ width: 320, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('failed live fetch keeps real saved values and never calls them live', async ({ page }) => {
  await page.route('https://games.roproxy.com/v1/games?*', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/Noichub/');
  await expect(page.locator('.player-status')).toContainText('Live update unavailable');
  await expect(page.locator('.game-card')).toHaveCount(PLACE_IDS.length);
  await expect(page.locator('.game-players.is-live')).toHaveCount(0);
  const game = snapshot.games[0] as Game;
  await expect(page.locator(`.game-card[href="${game.url}"] .game-players`)).toHaveText(`${(game.playing ?? 0).toLocaleString('en-US')} last known`);
});

test('refreshes after 60 seconds and rejects missing or invalid counts', async ({ page }) => {
  let requests = 0;
  await page.clock.install();
  await page.route('https://games.roproxy.com/v1/games?*', route => {
    requests++;
    return route.fulfill({ json: { data: requests === 1
      ? snapshot.games.map(game => ({ id: game.universeId, playing: 42 }))
      : [{ id: snapshot.games[0].universeId, playing: 999 }, { id: snapshot.games[1].universeId, playing: -5 }, { id: snapshot.games[2].universeId, playing: '999999' }, { id: 1, playing: 888888 }],
    } });
  });
  await page.goto('/Noichub/');
  await expect(page.locator('.player-status')).toContainText('Live Roblox players');
  expect(requests).toBe(1);
  await page.clock.fastForward(61_000);
  await expect(page.locator('.player-status')).toContainText('some counts are last known');
  expect(requests).toBe(2);
  await expect(page.locator('.game-card').first()).toHaveAttribute('href', snapshot.games[0].url);
  await expect(page.locator('.game-players.is-live')).toHaveCount(1);
  await expect(page.locator('.game-players.is-saved').first()).toHaveText('42 last known');
});

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`updated game controls fit at ${width}px`, async ({ page }) => {
    await page.route('https://games.roproxy.com/v1/games?*', route => route.fulfill({ json: { data: snapshot.games.map(game => ({ id: game.universeId, playing: game.playing ?? 0 })) } }));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/Noichub/');
    await expect(page.locator('.player-status')).toContainText('Live Roblox players');
    await expect(page.getByText('30,000+', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 1440) {
      await expect(page.locator('.hero-visual')).toHaveCSS('opacity', '1');
      await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
      await page.screenshot({ path: 'test-results/updated-hero-desktop.png' });
    }
    await page.locator('#games').evaluate(section => section.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await expect(page.locator('.games-grid > div').first()).toHaveCSS('opacity', '1');
    await expect(page.getByLabel('Sort supported games')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 1440 || width === 375) await page.screenshot({ path: `test-results/updated-games-${width}.png` });
  });
}
