const dbConfig = require("../config/db.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.url = dbConfig.url;
db.shows = require("./shows.model.js")(mongoose);
db.publisher = require("./publisher.model.js")(mongoose);
db.apikey = require("./apikey.model.js")(mongoose);
db.usage = require("./usage.model.js")(mongoose);
db.usageplan = require("./usageplan.model.js")(mongoose);
module.exports = db;