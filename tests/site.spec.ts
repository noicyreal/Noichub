import { test, expect } from '@playwright/test';
import { LOADER, DISCORD_URL, PLACE_IDS } from '../lib/constants';

test('real metadata, all destinations, and local screenshots', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle('NoicHub — Roblox Lua Hub');
  await expect(page.locator('.game-card')).toHaveCount(11);
  for (const id of PLACE_IDS) await expect(page.locator(`.game-card[href="https://www.roblox.com/games/${id}"]`)).toHaveAttribute('target', '_blank');
  for (const link of await page.locator('a[href*="discord.com"]').all()) { await expect(link).toHaveAttribute('href', DISCORD_URL); await expect(link).toHaveAttribute('rel', 'noopener noreferrer'); }
  const data = await (await request.get('/api/games')).json();
  expect(data.games).toHaveLength(11);
  for (const game of data.games) { expect(game.name).toBeTruthy(); expect(new URL(game.image).hostname).toMatch(/\.rbxcdn\.com$/); }
  for (let i = 1; i <= 3; i++) { const response = await request.get(`/images/showcase/noichub-${i}.webp`); expect(response.ok()).toBeTruthy(); expect(response.headers()['content-type']).toContain('image/webp'); }
  expect(await page.locator('img[src*="discord"]').count()).toBe(0);
  for (const card of await page.locator('.game-card').all()) await card.scrollIntoViewIfNeeded();
  await expect(page.locator('.game-card img')).toHaveCount(11);
  await expect.poll(() => page.locator('.game-card img').evaluateAll(imgs => imgs.every(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
  expect(errors).toEqual([]);
});

test('exact loader clipboard and denied clipboard fallback', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('button', { name: 'Copy script', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Copied!' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(LOADER);
  await page.evaluate(() => { Object.defineProperty(navigator.clipboard, 'writeText', { value: () => Promise.reject(new Error('Denied')), configurable: true }); });
  await page.getByRole('button', { name: 'Copied!' }).click();
  await expect(page.getByText('Clipboard unavailable.', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(LOADER);
});

test('showcase tabs, focus trap, slide navigation, and escape', async ({ page }) => {
  await page.goto('/');
  const tab = page.getByRole('tab', { name: '02 Riotfall' });
  await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true');
  await tab.press('ArrowRight');
  await expect(page.getByRole('tab', { name: '03 Frontlines' })).toBeFocused();
  const trigger = page.getByRole('button', { name: 'View Frontlines screenshot full size' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close screenshot' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Next screenshot' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByText('Defusal', { exact: false })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('search, empty state, and clear', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('searchbox');
  await search.fill('frontlines');
  await expect(page.locator('.game-card')).toHaveCount(1);
  await search.fill('not-a-real-experience');
  await expect(page.getByRole('heading', { name: 'No games found' })).toBeVisible();
  await page.getByRole('button', { name: 'Show all games' }).click();
  await expect(page.locator('.game-card')).toHaveCount(11);
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`responsive layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    for (const section of await page.locator('main section[id]').all()) { await section.scrollIntoViewIfNeeded(); expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true); }
    if (width < 768) {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await expect(page.locator('#mobile-menu')).toBeVisible();
      await page.locator('#mobile-menu').getByRole('link', { name: 'Script', exact: true }).click();
      await expect(page.locator('#mobile-menu')).not.toBeVisible();
      await expect(page).toHaveURL(/#script$/);
    }
    for (const card of await page.locator('.feature-card, .game-card').all()) await card.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `test-results/noichub-${width}.png`, fullPage: true });
  });
}

test('broken thumbnail gracefully falls back', async ({ page }) => {
  await page.route('**/*.rbxcdn.com/**', route => route.abort());
  await page.goto('/');
  await page.locator('#games').scrollIntoViewIfNeeded();
  await expect(page.locator('.game-placeholder').first()).toBeVisible();
  await expect(page.locator('.game-card')).toHaveCount(11);
});
