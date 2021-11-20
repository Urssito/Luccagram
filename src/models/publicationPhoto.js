const mongo = require("mongoose");
const { Schema } = mongo;

const profilePhoto = new Schema({

    userId: {type: String, required: true},
    user: {type: String, required: true},
    filename: {type:String, require: true, default: "profilePhoto"},
    format: {type:String, required: true},
    parentId: {type: String, required: true},
    date: {type: Date, default: Date.now}

},
{
    collection: "publicationphotos"
});

module.exports = mongo.model("profilePhoto", profilePhoto);