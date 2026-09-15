import gameConfig from '@/games.json';
import { parseGameConfig } from './game-config.mjs';
export const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
export const DISCORD_URL = 'https://discord.com/invite/UBeRG8Qp2f';
export const LOADER = 'loadstring(game:HttpGet("https://raw.githubusercontent.com/noicyreal/Noichub/refs/heads/main/loader.luau"))()';
// Edit games.json to add/remove games or change their script status.
export const GAME_ENTRIES = parseGameConfig(gameConfig);
export const PLACE_IDS = GAME_ENTRIES.map(game => game.placeId);
export const GAME_STATUSES = Object.fromEntries(GAME_ENTRIES.map(game => [game.placeId, game.status]));
export const SCREENSHOTS = [
  { src: assetPath('/images/showcase/noichub-1.webp'), name: 'Defusal', description: 'The details make the difference.', width: 1299, height: 731 },
  { src: assetPath('/images/showcase/noichub-2.webp'), name: 'Riotfall', description: 'A familiar interface. A different experience.', width: 717, height: 649 },
  { src: assetPath('/images/showcase/noichub-3.webp'), name: 'Frontlines', description: 'Everything right where you need it.', width: 751, height: 713 },
];
export type Game = { placeId: string; universeId?: number; name: string | null; image: string | null; url: string; playing?: number | null; playersUpdatedAt?: string | null; status?: 'undetected' | 'patched' };
