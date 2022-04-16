const { MessageEmbed } = require("discord.js");
const Player = require("../models/player");

module.exports = {
    options: {
        name: "profile",
        description: "Shows your profile in the rps"
    },

    interact: async (interaction) => {
        const data = await Player.findOne({ _id: interaction.user.id });

        if (!data) {
            return interaction.reply({
                content: ":x: You have to play a game and have at least one win or lose."
            }).catch(() => {});
        };

        const embed = new MessageEmbed()
            .setTitle(`${interaction.user.username}'s Profile`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setColor(8948363)
            .addField(":dart: Wins", String(data.wins.humans), true)
            .addField(":no_entry_sign: Loses", String(data.loses.humans), true)
            .addField(":robot: Against Bot", `Wins: ${data.wins.bots}\nLoses: ${data.loses.bots}`, false)
            .addField("Badges", "None")
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        return interaction.reply({
            embeds: [embed]
        }).catch(() => {});
    },
};