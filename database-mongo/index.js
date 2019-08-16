const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/psaDb", { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
mongoose.Promise = require("bluebird");

const db = mongoose.connection;

db.on("error", function() {
  console.log("mongoose connection error");
});

db.once("openUri", function() {
  console.log("mongoose connected successfully");
});

module.exports = mongoose;
