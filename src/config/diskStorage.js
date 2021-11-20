const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{        
        callback(null, path.join(__dirname, "..", "public", "img", "users", "temp"));
    },
    filename: (req, file, cb) => {
        let ext = file.originalname.split(".").pop();
        cb(null, "profile" + req.user.id + "." + ext);
    }
});
module.exports = storage;
