const {
    Schema,
    models,
    model
} = require("mongoose");

const Player = new Schema({
    _id: String,
    wins: {
        humans: { type: Number, default: 0 },
        bots: { type: Number, default: 0 }
    },
    loses: {
        humans: { type: Number, default: 0 },
        bots: { type: Number, default: 0 }
    }
}, { versionKey: false, timestamps: true });

module.exports = models.players || model("players", Player);