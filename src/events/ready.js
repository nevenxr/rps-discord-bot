module.exports = {
    name: "ready",
    exec: () => {
        const { client } = global;

        console.log(`${client.user?.username} is now online`);
        client.user.setActivity("rps help", {
            type: "WATCHING"
        });
    },
};