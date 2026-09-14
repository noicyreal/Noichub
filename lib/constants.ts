export const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
export const DISCORD_URL = 'https://discord.com/invite/UBeRG8Qp2f';
export const LOADER = 'loadstring(game:HttpGet("https://raw.githubusercontent.com/noicyreal/Noichub/refs/heads/main/loader.luau"))()';
export const PLACE_IDS = ['79393329652220','120189115846709','7796842481','76822114837453','110808833601416','5938036553','132640332499066','574407221','139988436996662','129870876180628','17738127017'] as const;
export const SCREENSHOTS = [
  { src: assetPath('/images/showcase/noichub-1.webp'), name: 'Defusal', description: 'The details make the difference.', width: 1299, height: 731 },
  { src: assetPath('/images/showcase/noichub-2.webp'), name: 'Riotfall', description: 'A familiar interface. A different experience.', width: 717, height: 649 },
  { src: assetPath('/images/showcase/noichub-3.webp'), name: 'Frontlines', description: 'Everything right where you need it.', width: 751, height: 713 },
];
export type Game = { placeId: string; universeId?: number; name: string | null; image: string | null; url: string };
