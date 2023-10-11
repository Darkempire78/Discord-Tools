const { Schema, model} = require('mongoose');

let Prefix = new Schema({
    Guild : String,
    Prefix : String, 
    oldPrefix: String,
})

module.exports = model('prefix', Prefix);

/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */