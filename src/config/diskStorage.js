const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{        
        callback(null, path.join(__dirname, "..", "temp"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
module.exports = storage;
