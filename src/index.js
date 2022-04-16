const env = require("dotenv").config();
const client = require("./structs/client").Client;
const mongoose = require("mongoose");

(async () => {
    mongoose.connection.once("open", () => console.log("Database connected"));
    await mongoose.connect(process.env.MONGODB);
})();

global.client = new client({
    token: process.env.TOKEN,
    shards: "auto",
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);