const mongoose = require('mongoose');
var path = require("path");
const config = require(path.join(__dirname, '../config/config.js')); //'./config/config.js');
let db_url = global.gConfig.databaseUri;
let mongoDB = process.env.MONGODB_URI || db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//https://medium.freecodecamp.org/introduction-to-mongoose-for-mongodb-d2a7aa593c57