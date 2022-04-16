const fs = require("fs");

exports.loadCommands = function (client) {
    const readdir = fs.readdirSync(require.main?.path + "/commands")
        .filter((ext) => ext.endsWith(".js"));

    const commands = [];
    for (const file of readdir) {
        const command = require(`../commands/${file}`);

        if (typeof command === "object" && command.options) {
            const { options } = command;

            commands.push(options);
            client.commands.set(options.name, command);
        };
    };

    client.once("ready", () => {
        client.guilds.cache.get("935384834250006569").commands.set(commands);
    })
};