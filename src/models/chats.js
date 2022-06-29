const mongo = require("mongoose");
const { Schema } = mongo;

const chats = new Schema({

    transmitter: [{type:String, required:true}],
    receiver: [{type:String, required:true}],
    chat: [{type:String, required: true}]

});

module.exports = mongo.model("chats", chats);