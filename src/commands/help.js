const { MessageEmbed } = require("discord.js");


module.exports = {
    options: {
        name: "help",
        description: "Get a list of my commands"
    },
    interact: (interaction) => {
        const embed = new MessageEmbed()
            .setTitle("RPS Help")
            .setDescription("Here is the list of my commands:")
            .setThumbnail(global.client.user?.displayAvatarURL())
            .setColor(8948363)
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        const commands = []

        const { client } = global;
        client.commands.forEach((k) => commands.push(`\`${k.options.name}\``));
        embed.addField("Commands", `${commands.join(" ")}`)
        return interaction.reply({
            embeds: [embed]
        }).catch(() => {});
    },
};