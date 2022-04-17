module.exports = {
    name: "ready",
    exec: () => {
        const { client } = global;

        console.log(`${client.user?.username} is now online`);
        setInterval(() => {
            client.user.setActivity(`/help | ${client.guilds.cache.size} Guilds`, {
                type: "LISTENING"
            });
        }, 1000 * 20);
    },
};