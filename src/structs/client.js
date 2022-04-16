const {
    Client,
    Collection
} = require("discord.js");

const { listenEvents } = require("../functions/listenEvents");
const { loadCommands } = require("../functions/loadCommands");

exports.Client = class RPS extends Client {
    constructor (options) {
        super(options);
        this.commands = new Collection();
        
        listenEvents(this);
        loadCommands(this);

        const { token } = options;

        if (token) {
            this.login(token);
        } else throw new TypeError("You didn't set the token on .env");
    };
};