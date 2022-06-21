const mongo = require("mongoose");
const { Schema } = mongo;

const notification = new Schema({

    transmitter: {type:String, required:true},
    title: {type:String, required:true},
    description: {type:String, required:true},
    receiver: [{type:String, required:true}],

});

module.exports = mongo.model("notification", notification);