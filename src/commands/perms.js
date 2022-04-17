const { MessageEmbed } = require("discord.js");

module.exports = {
    options: {
        name: "perms",
        description: "Check if I have proper permissions"
    },
    interact: (interaction) => {
        const perms = {
            SEND_MESSAGES: "Send Messages",
            EMBED_LINKS: "Embed Links",
            ADD_REACTIONS: "Add Reactions",
            MANAGE_MESSAGES: "Manage Messages"
        };

        const empty = [];
        const permission = interaction.guild.me.permissions;
        
        for (const key of Object.keys(perms)) {
            if (permission.has(key)) {
                empty.push(`:white_check_mark: ${perms[key]}`);
            } else {
                empty.push(`:x: ${perms[key]}`);
            };
        };

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Permissions")
                    .setColor(8948363)
                    .setDescription(`These are the permissions I require to function properly:\n\n${empty.join("\n")}`)
                    .setFooter({
                        text: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true})
                    })
                    .setTimestamp()
            ]
        }).catch(() => {});
    },
};