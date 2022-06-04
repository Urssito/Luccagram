const mongo = require("mongoose");

mongo.connect(process.env.MONGO_DB)
  .then(db => console.log("DB connected in: ", process.env.MONGO_DB))
  .catch(err => {console.log(err)})