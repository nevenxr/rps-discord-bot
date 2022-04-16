const { CommandInteraction } = require("discord.js");

module.exports = {
    options: {
        name: "ping",
        description: "Ping Pong"
    },
    /**
     * @param {CommandInteraction} interaction
     */
    interact: async (interaction) => {
        const defer = await interaction.deferReply({ fetchReply: true });
        const time = (defer.createdTimestamp) ? defer.createdTimestamp : new Date(defer.timestamp).getTime();
        return interaction.editReply(`:ping_pong: Pong! \`${time - interaction.createdTimestamp}ms\``).catch(() => {});
    },
};