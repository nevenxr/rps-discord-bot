module.exports = {
    name: "interactionCreate",
    exec: (interaction) => {
        if (!interaction.isCommand()) return;

        if (!interaction.guild.me.permissions.has([
            "SEND_MESSAGES", "EMBED_LINKS"
        ])) return;

        const { commandName } = interaction;
        const command = global.client.commands.get(commandName);

        if (command) return command.interact(interaction);
    },
};