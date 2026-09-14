local scripts = {
    -- Brace
    [17738127017] = "https://raw.githubusercontent.com/noicyreal/bracehub/main/brace.lua",

    -- Guess the Country
    [129870876180628] = "https://raw.githubusercontent.com/noicyreal/bracehub/main/guess.lua",

    -- Stop the Timer
    [139988436996662] = "https://raw.githubusercontent.com/noicyreal/bracehub/main/stopthetimer.lua",

    -- Super Hero Tycoon
    [574407221] = "https://raw.githubusercontent.com/noicyreal/bracehub/main/superherotycoon.lua",

    -- Global Anarchy
    [132640332499066] = "https://raw.githubusercontent.com/noicyreal/bracehub/main/anarchy.luau",

    -- Frontlines
    [5938036553] = "https://raw.githubusercontent.com/noicyreal/bracehub/main/frontlines.luau",

    -- Chameleon
    [110808833601416] = "https://raw.githubusercontent.com/noicyreal/bracehub/main/cham.lua",

    -- War Ground
    [76822114837453] = "https://raw.githubusercontent.com/noicyreal/bracehub/main/war.luau",

    -- Riotfall
    [7796842481] = "https://raw.githubusercontent.com/noicyreal/bracehub/main/riotfall.luau",

    -- TTK Testing [HARDPOINT]
    [120189115846709] = "https://raw.githubusercontent.com/noicyreal/bracehub/main/ttk.luau",

    -- Defusal
    [79393329652220] = "https://raw.githubusercontent.com/noicyreal/bracehub/main/defusal.luau",
}

local scriptUrl = scripts[game.PlaceId]

if scriptUrl then
    loadstring(game:HttpGet(scriptUrl))()
else
    warn("We dont support this game. PlaceId:", game.PlaceId)
end
