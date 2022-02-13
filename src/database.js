const mongo = require("mongoose");
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, 'mongoData.json')

if(fs.existsSync(dir)){
    let uri = fs.readFileSync(dir);
    uri = JSON.parse(uri);

    mongo.connect(uri.uri[0])
      .then(db => console.log("DB connected in: ", uri.uri[0]))
      .catch(err => {console.log(err)})
}