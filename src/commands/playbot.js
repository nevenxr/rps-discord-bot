const { MessageEmbed } = require("discord.js");

const choices = [
    "rock",
    "paper",
    "scissors"
];

const emojis = {
    rock: ":rock:",
    paper: ":newspaper:",
    scissors: ":scissors:",
};

module.exports = {
    options: {
        name: "playbot",
        description: "Play rps against the bot",
        options: [
            {
                type: "STRING",
                name: "throw",
                description: "Throw your choice",
                choices: [
                    {
                        name: "rock",
                        value: "rock"
                    },
                    {
                        name: "paper",
                        value: "paper"
                    },
                    {
                        name: "scissors",
                        value: "scissors"
                    }
                ],
                required: true
            }
        ]
    },

    interact: (interaction) => {
        const chose = interaction.options.getString("throw");
        var botChoice = null;
        var whoWins = null;

        botChoice = choices[Math.floor(Math.random() * choices.length)];

        switch (chose) {
            case "rock": {
                // Bot Rock
                switch (botChoice) {
                    case "rock": {
                        whoWins = "draw";
                    };
                    break;
                    case "paper": {
                        whoWins = "bot";
                    };
                    break;
                    case "scissors": {
                        whoWins = "user"
                    };
                    break
                };
            };
            break;
            case "paper": {
                // Bot Paper
                switch (botChoice) {
                    case "rock": {
                        whoWins = "user";
                    };
                    break;
                    case "paper": {
                        whoWins = "draw";
                    };
                    break;
                    case "scissors": {
                        whoWins = "bot"
                    };
                    break
                };
            };
            break;
            case "scissors": {
                // Bot Scissors
                switch (botChoice) {
                    case "rock": {
                        whoWins = "bot";
                    };
                    break;
                    case "paper": {
                        whoWins = "user";
                    };
                    break;
                    case "scissors": {
                        whoWins = "draw"
                    };
                    break
                };
            };
        };

        var winType = "";

        if (whoWins === "user") winType = "won"
        if (whoWins === "draw") winType = "drawn";
        if (whoWins === "bot") winType = "lost";

        var text = `${interaction.user.username} ${winType} the battle against the bot`;
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("RPS Results")
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(text)
                    .setColor(8948363)
                    .addField("You", emojis[chose], true)
                    .addField("Bot", emojis[botChoice], true)
                    .setTimestamp()
            ]
        }).catch(() => {});
    },
};