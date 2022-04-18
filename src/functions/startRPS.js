const { addWin, addLose } = require("../functions/database");
const { MessageEmbed } = require("discord.js");
const emojis = {
    rock: ":rock:",
    paper: ":newspaper:",
    scissors: ":scissors:",
};


async function startRPS (interaction, player, opponent) {
    const { client } = global;
    
    const opponentDM = await opponent.user.send({
        embeds: [
            getBattleEmbed(opponent)
                .addField("Your Choice", "Awaiting :stopwatch:", true)
        ]
    }).catch(() => false);

    if (!opponentDM) {
        client.playing.delete(opponent.user.id);
        client.playing.delete(player.user.id);

        return interaction.channel.send({
            content: `<@!${opponent.user.id}>,:x: The battle has failed due to your DMS being closed.`
        }).catch(() => {});
    };

    await opponentDM.react("🪨");
    await opponentDM.react("📰");
    await opponentDM.react("✂️");

    const opponentCollector = await opponentDM.createReactionCollector({
        filter: (r, u) => u.id === opponent.user.id,
        time: 15000,
        max: 1,
    });

    var opponentChoice = null;
    var playerChoice = null;

    opponentCollector.on("collect", async (react) => {
        switch (react.emoji.name) {
            case "🪨":
                opponentChoice = "rock";
            break;
            case "📰":
                opponentChoice = "paper";
            break;
            case "✂️": 
                opponentChoice = "scissors";
            break;
        };
    });

    opponentCollector.on("end", async () => {
        client.playing.delete(opponent.user.id);
        client.playing.delete(player.user.id);

        if (!opponentChoice) {
            await opponentDM.edit({
                embeds: [
                    getBattleEmbed(opponent)
                    .addField("Your Choice", "Timed out! :stopwatch:", true)
                ]
            }).catch(() => {});
            
            return sendTimeoutMessage(interaction, player, opponent, opponent);
        } else {
            await opponentDM.edit({
                embeds: [
                    getBattleEmbed(opponent)
                    .addField("Your Choice", `${emojis[opponentChoice]}`, true)
                ]
            }).catch(() => {});

            getPlayerChoice();
        };
    });

    async function getPlayerChoice () {
        const playerDM = await player.user.send({
            embeds: [
                getBattleEmbed(player)
                    .addField("Your Choice", "Awaiting :stopwatch:", true)
            ]
        }).catch(() => false);
    
        if (!playerDM) {
            client.playing.delete(player.user.id);
            client.playing.delete(opponent.user.id);
    
            return interaction.channel.send({
                content: `<@!${player.user.id}>,:x: The battle has failed due to your DMS being closed.`
            }).catch(() => {});
        };
    
        await playerDM.react("🪨");
        await playerDM.react("📰");
        await playerDM.react("✂️");
    
        const playerCollector = await playerDM.createReactionCollector({
            filter: (r, u) => u.id === player.user.id,
            time: 15000,
            max: 1,
        });

        playerCollector.on("collect", async (react) => {
            switch (react.emoji.name) {
                case "🪨":
                    playerChoice = "rock";
                    break;
                case "📰":
                    playerChoice = "paper";
                    break;
                case "✂️": 
                    playerChoice = "scissors";
                    break;
            };
        });

        playerCollector.on("end", async () => {
            client.playing.delete(opponent.user.id);
            client.playing.delete(player.user.id);

            if (!playerChoice) {
                await playerDM.edit({
                    embeds: [
                        getBattleEmbed(player)
                        .addField("Your Choice", "Timed out! :stopwatch:", true)
                    ]
                }).catch(() => {});
                
                return sendTimeoutMessage(interaction, player, opponent, player);
            } else {
                await playerDM.edit({
                    embeds: [
                        getBattleEmbed(player)
                        .addField("Your Choice", `${emojis[playerChoice]}`, true)
                    ]
                }).catch(() => {});

                return getResults();
            };
        });

        function getResults () {
            const winner = getWinner(playerChoice, opponentChoice);

            var winType = "";

            if (winner === "player") {
                addLose(opponent.user.id, "humans", 1);
                addWin(player.user.id, "humans", 1);
                winType = "won";
            };
            
            if (winner === "draw") winType = "drew";
            if (winner === "opponent") {
                addWin(opponent.user.id, "humans", 1);
                addLose(player.user.id, "humans", 1);
                winType = "lost";
            };

            interaction.channel.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle("RPS Results")
                    .setDescription(`${player.user.username} ${winType} in the battle with ${opponent.user.username}`)
                    .addField("Player", `${emojis[playerChoice]}`, true)
                    .addField("Opponent", `${emojis[opponentChoice]}`, true)
                    .setColor(8948363)
                    .setTimestamp()
                ]
            })
        };
    };
};

function sendTimeoutMessage (interaction, player, opponent, tby) {
    return interaction.channel.send({
        embeds: [
            new MessageEmbed()
                .setTitle("RPS Results")
                .setDescription(`${tby.user.username} did not choose in time! :stopwatch: Battle has failed.`)
                .addField("Player", `${player.user.tag}`, true)
                .addField("Opponent", `${opponent.user.tag}`, true)
                .setColor(8948363)
                .setTimestamp()
        ]
    }).catch(() => {});
};

function getBattleEmbed(player) {
    const battleEmbed = new MessageEmbed()
        .setTitle(":crossed_swords: Battle")
        .setThumbnail(player.user.displayAvatarURL({ dynamic: true }))
        .setColor(8948363)
        .setDescription(`You are in battle with ${player.user.username}`)
        .addField("Mode", "PvP", true)
        .setTimestamp()

    return battleEmbed;
};

function getWinner (playerChoice, opponentChoice) {
    var winner = null;

    switch (playerChoice) {
        case "rock": {
            // Opponent Rock
            switch (opponentChoice) {
                case "rock": {
                    winner = "draw";
                };
                break;
                case "paper": {
                    winner = "opponent";
                };
                break;
                case "scissors": {
                    winner = "player"
                };
                break;
            };
        };
        break;
        case "paper": {
            // Opponent Paper
            switch (opponentChoice) {
                case "rock": {
                    winner = "player";
                };
                break;
                case "paper": {
                    winner = "draw";
                };
                break;
                case "scissors": {
                    winner = "opponent"
                };
                break;
            };
        };
        break;
        case "scissors": {
            // Opponent Scissors
            switch (opponentChoice) {
                case "rock": {
                    winner = "opponent";
                };
                break;
                case "paper": {
                    winner = "player";
                };
                break;
                case "scissors": {
                    winner = "draw"
                };
                break;
            };
        };
    };

    return winner;
};

module.exports = startRPS;