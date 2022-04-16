module.exports = {
    options: {
        name: "invite",
        description: "Add the RPS bot to your server"
    },
    interact: (interaction) => {
        return interaction.reply({
            content: "[Click here to add to your server](https://discord.com/api/oauth2/authorize?client_id=964850934419173466&permissions=52288&scope=bot%20applications.commands)"
        }).catch(() => {});
    },
};