const mongo = require("mongoose");

uri = "mongodb://localhost:27017/lg-db-app";

mongo.connect(uri)
  .then(db => console.log("DB connected in: ", uri))
  .catch(err => {console.error(err)})