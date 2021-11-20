const mongo = require("mongoose");

uri = "mongodb+srv://urssito:<password>@cluster0.vosld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongo.connect(uri)
  .then(db => console.log("DB connected in: ", uri))
  .catch(err => {console.error(err)})