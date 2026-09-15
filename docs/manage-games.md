# Add games or change status in one file

Open [games.json on GitHub](https://github.com/noicyreal/Noichub/edit/main/games.json), click the pencil if needed, make your change, then **Commit changes** to `main`. GitHub automatically updates the website, usually in about a minute.

## Add a game

Copy the number from its Roblox URL. For `https://www.roblox.com/games/123456/My-Game`, add this line inside the braces:

```json
"123456": "undetected"
```

Use the real ID instead of `123456`. Put a comma after every line except the last one. The website automatically gets the actual name, thumbnail, universe ID, and player count. You do not edit React components or the generated `lib/games-snapshot.json` file.

## Change status

Find the game's ID and change its value:

```json
"123456": "patched"
```

Change it back to `"undetected"` when you want the green badge again. All current entries are set to **Undetected** as requested. Statuses are manually maintained by NoicHub, not automatically detected. Status changes override the saved game data immediately on the next deployment, even if Roblox is unavailable.

Remove the entire line to remove a game from the website. Invalid IDs or status values stop the build with a helpful error; the existing published website stays online.

## Optional terminal shortcuts

```sh
npm run games -- list
npm run games -- add https://www.roblox.com/games/123456
npm run games -- status 123456 patched
npm run games -- status 123456 undetected
npm run games -- remove 123456
```

`list` shows names alongside IDs. These commands edit only `games.json`. Commit that file to publish. Adding a website card does not add Lua support to the hub; the loader and per-game scripts remain separately maintained.
