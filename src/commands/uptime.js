const parseMilliseconds = require("parse-ms");

module.exports = {
    options: {
        name: "uptime",
        description: "The uptime of the bot"
    },
    interact: (interaction) => {
        const parsed = parseMilliseconds(global.client.uptime);
        return interaction.reply({
            content: `:green_circle: Uptime: **${parsed.days}d, ${parsed.hours}h, ${parsed.minutes}m and ${parsed.seconds}s**`
        }).catch(() => {});
    },
};