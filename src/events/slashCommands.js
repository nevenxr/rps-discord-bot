module.exports = {
    name: "interactionCreate",
    exec: (interaction) => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;
        const command = global.client.commands.get(commandName);

        if (command) return command.interact(interaction);
    },
};