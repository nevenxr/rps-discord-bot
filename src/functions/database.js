const Schema = require("../models/player");

async function addWin (_id, property, rate) {
    var data = await Schema.findOne({ _id });
    
    if (!data) {
        data = {
            _id,
            wins: {}
        };

        data.wins[property] = rate;
        data = new Schema(data);
    } else {
        data.wins[property] = data.wins[property] + rate;
    };

    await data.save();
};

async function addLose (_id, property, rate) {
    var data = await Schema.findOne({ _id });
    
    if (!data) {
        data = {
            _id,
            loses: {}
        };

        data.loses[property] = rate;
        data = new Schema(data);
    } else {
        data.loses[property] = data.loses[property] + rate;
    };

    await data.save();
};

module.exports = {
    addWin,
    addLose
};