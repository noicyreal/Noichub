/**
 * @param {unknown} input
 * @returns {Array<{placeId: string, status: 'undetected' | 'patched'}>}
 */
export function parseGameConfig(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('games.json must map Roblox place IDs to "undetected" or "patched".');
  }
  const entries = Object.entries(input);
  if (entries.length === 0) throw new Error('Add at least one game to games.json.');
  return entries.map(([placeId, status]) => {
    if (!/^[1-9]\d*$/.test(placeId) || !Number.isSafeInteger(Number(placeId))) {
      throw new Error(`Invalid place ID "${placeId}" in games.json. Copy the number from the Roblox game URL.`);
    }
    if (status !== 'undetected' && status !== 'patched') {
      throw new Error(`Invalid status for ${placeId}: use "undetected" or "patched".`);
    }
    return { placeId, status };
  });
}

/** @param {string} input */
export function parsePlaceId(input) {
  const value = input.trim();
  if (/^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value))) return value;
  try {
    const url = new URL(value);
    const match = url.pathname.match(/^\/games\/([1-9]\d*)(?:\/|$)/);
    if ((url.hostname === 'www.roblox.com' || url.hostname === 'roblox.com') && url.protocol === 'https:' && match && Number.isSafeInteger(Number(match[1]))) return match[1];
  } catch { /* A useful error below covers invalid URLs and IDs. */ }
  throw new Error('Use a Roblox place ID or an https://www.roblox.com/games/123456 URL.');
}
