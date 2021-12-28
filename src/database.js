const mongo = require("mongoose");

uri = "mongodb+srv://urssito:Ciredin231+@cluster0.vosld.mongodb.net/lg-db-app?retryWrites=true&w=majority";

mongo.connect(uri)
  .then(db => console.log("DB connected in: ", uri))
  .catch(err => {console.error(err)})