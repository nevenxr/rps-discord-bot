const env = require("dotenv").config();
const client = require("./structs/client").Client;

global.client = new client({
    token: process.env.TOKEN,
    shards: "auto",
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);