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

        if (!interaction.channel.permissionsFor(interaction.guild.me).has(["MANAGE_MESSAGES", "ADD_REACTIONS"])) {
            return;
        };

        if (opponent.user.bot) {
            return interaction.reply({
                content: ":x: You can't battle a bot!\nPlay `/playbot` instead."
            }).catch(() => {});;
        };

        if (opponent.user.id === interaction.user.id) {
            return interaction.reply({
                content: ":x: You can't battle yourself!\nPlay `/playbot` instead."
            }).catch(() => {});;
        };

        const isPlaying = client.playing.get(opponent.user.id);

        if (isPlaying) {
            return interaction.reply({
                content: `:x: ${opponent.user.username} is already in battle with someone.`
            }).catch(() => {});;
        };

        const req = await interaction.reply({
            content: `<@${opponent.user.id}>`,
            embeds: [
                getRequestEmbed(interaction).addField("Battle", "Awaiting :stopwatch:", true)
            ],
            fetchReply: true
        }).catch(() => {});;

        await req.react("✅").catch(() => {});
        await req.react("❌").catch(() => {});

        const reactCollector = req.createReactionCollector({
            filter: (r, u) => u.id === opponent.user.id,
            time: 30000,
            max: 1
        });

        var reacted = false;

        reactCollector.on("collect", async (react) => {
            if (react.emoji.name === "✅") {
                reacted = true;
                global.client.playing.set(opponent.user.id, true);
                req.edit({
                    embeds: [
                        getRequestEmbed(interaction).addField("Battle", "Accepted :white_check_mark:", true)
                    ]
                }).catch(() => {});;

                await req.reactions.removeAll().catch(() => {});
                await startRPS(interaction, interaction.member, opponent);
            };

            if (react.emoji.name === "❌") {
                reacted = true
                req.edit({
                    embeds: [
                        getRequestEmbed(interaction).addField("Battle", "Rejected :x:", true)
                    ]
                }).catch(() => {});

                await req.reactions.removeAll();
            };
        });

        reactCollector.on("end", async () => {
            if (!reacted) {
                await req.reactions.removeAll();
                await req.edit({
                    embeds: [
                        getRequestEmbed(interaction).addField("Battle", "Timed out! :stopwatch:", true)
                    ]
                }).catch(() => {});
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