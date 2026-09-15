import { readFile, writeFile, rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseGameConfig, parsePlaceId } from '../lib/game-config.mjs';

const path = resolve('games.json');
const [command = 'help', input, statusInput] = process.argv.slice(2);
try {
  const config = JSON.parse(await readFile(path, 'utf8'));
  const entries = parseGameConfig(config);
  if (command === 'list') {
    const snapshot = JSON.parse(await readFile('lib/games-snapshot.json', 'utf8'));
    for (const entry of entries) {
      console.log(`${entry.placeId}  ${entry.status.padEnd(10)}  ${snapshot.games.find(game => game.placeId === entry.placeId)?.name ?? 'Name fetched on next deploy'}`);
    }
  } else if (['add', 'status', 'remove'].includes(command)) {
    if (!input) throw new Error('Include the Roblox game URL or place ID. Run npm run games for examples.');
    const placeId = parsePlaceId(input);
    if (command === 'add' && placeId in config) throw new Error('This game is already listed. Use the status command to update it.');
    if (command !== 'add' && !(placeId in config)) throw new Error('This game is not listed. Use the add command first.');
    if (command === 'remove') delete config[placeId];
    else config[placeId] = statusInput ?? (command === 'add' ? 'undetected' : '');
    parseGameConfig(config);
    const temporary = `${path}.tmp`;
    await writeFile(temporary, JSON.stringify(config, null, 2) + '\n');
    await rename(temporary, path);
    console.log(`Updated games.json: ${placeId} ${command === 'remove' ? 'removed' : config[placeId]}.`);
    console.log('Commit games.json to main on GitHub to publish. Names, thumbnails, and counts are fetched automatically.');
  } else if (command === 'help') {
    console.log(`Manage NoicHub games (edit games.json directly on GitHub if you prefer):
  npm run games -- list
  npm run games -- add https://www.roblox.com/games/123456
  npm run games -- status 123456 patched
  npm run games -- status 123456 undetected
  npm run games -- remove 123456

Adding defaults to undetected. Use the real place ID. Changes affect the website only; adding script support is separate.`);
  } else throw new Error(`Unknown command: ${command}. Run npm run games for help.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
