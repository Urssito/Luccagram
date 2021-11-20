const mongo = require("mongoose");
const { Schema } = mongo;

const publicacion = new Schema({

    title: {type: String, required: true},
    publication: {type:String, required: true},
    date: {type: Date, default: Date.now},
    userId: {type: String, required: true},
    user: {type: String, required: true}

});

module.exports = mongo.model("publication", publicacion);