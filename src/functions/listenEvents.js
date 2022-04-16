const fs = require("fs");

exports.listenEvents = function (client) {
    const readdir = fs.readdirSync(require.main?.path + "/events")
        .filter((ext) => ext.endsWith(".js"));

    for (const file of readdir) {
        const event = require(`../events/${file}`);

        if (typeof event === "object" && event.name) {
            client[
                event.once ? "once" : "on"
            ](event.name, event.exec);
        };
    };
};