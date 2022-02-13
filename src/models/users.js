const mongo = require("mongoose"),
      { Schema } = mongo,
      bcrypt = require("bcryptjs"),
      path = require("path");


// esquema de usuario

const usuario = new Schema({

    user: {type: String, required: true},
    password: {type:String, required: true},
    email: {type:String, required: true},
    date: {type: Date, default: Date.now},
    description: {type: String, required: true, default: "hola!"},
    followers: [{type: String, required: false}],
    Google: {
        drivePath: {type: String, required: false},
        profilePicId: {type: String, required: false, default: ''}
    },
    profilePhoto: {
        filename: {type: String, required: true, default: 'profilePhoto.jpg'},
        path: {type: String, required: true, default: path.join(__dirname, '..', 'public', 'img', 'main')},
        ext: {type: String, required: true, default:'jpg'}
    }

}, {
    collection: "users"
});

usuario.methods.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash
};

usuario.methods.matchPassword = async function (password) {
    const pass = await bcrypt.compare(password, this.password);
    return pass
};

module.exports = mongo.model("user", usuario);