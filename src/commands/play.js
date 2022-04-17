const { MessageEmbed, CommandInteraction, Emoji } = require("discord.js");
const startRPS = require("../functions/startRPS");

module.exports = {
    options: {
        name: "play",
        description: "Play rps against a real person",
        options: [
            {
                type: "USER",
                name: "opponent",
                description: "The opponent to battle with",
                required: true
            }
        ]
    },
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    interact: async (interaction) => {
        const opponent = interaction.options.getMember("opponent");
        const { client } = global;

        if (opponent.user.bot) {
            return interaction.reply({
                content: ":x: You can't battle a bot!\nPlay `/playbot` instead."
            });
        };

        if (opponent.user.id === interaction.user.id) {
            return interaction.reply({
                content: ":x: You can't battle yourself!\nPlay `/playbot` instead."
            });
        };

        const isPlaying = client.playing.get(opponent.user.id);

        if (isPlaying) {
            return interaction.reply({
                content: `:x: ${opponent.user.username} is already in battle with someone.`
            });
        };

        const req = await interaction.reply({
            content: `<@${opponent.user.id}>`,
            embeds: [
                getRequestEmbed(interaction).addField("Battle", "Awaiting :stopwatch:", true)
            ],
            fetchReply: true
        });

        await req.react("✅");
        await req.react("❌");

        const reactCollector = req.createReactionCollector({
            filter: (r, u) => u.id === opponent.user.id,
            time: 15000
        });

        reactCollector.on("collect", async (react) => {
            if (react.emoji.name === "✅") {
                global.client.playing.set(opponent.user.id, true);
                req.edit({
                    embeds: [
                        getRequestEmbed(interaction).addField("Battle", "Accepted :white_check_mark:", true)
                    ]
                });

                await req.reactions.removeAll();
                await startRPS(interaction, interaction.member, opponent);
            };

            if (react.emoji.name === "❌") {
                req.edit({
                    embeds: [
                        getRequestEmbed(interaction).addField("Battle", "Rejected :x:", true)
                    ]
                });

                await req.reactions.removeAll();
            };
        });
    },
};

function getRequestEmbed (interaction) {
    return new MessageEmbed()
    .setTitle(":crossed_swords: Battle")
    .setColor("WHITE")
    .setDescription(`${interaction.user.username} requested to battle with you in rps`)
    .addField("Mode", "PvP", true)
    .setTimestamp()
};