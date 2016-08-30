/** Bring mongoose into the app */
var mongoose = require('mongoose');

/** Get the configuration variables */
var config = require('../config/config.js');

/** Create the database connection */
mongoose.connect(config.DB_URL);

/** To store the mongoose.connection object */
var db = mongoose.connection;

/** Connection events */

/** When successfully connected */
db.on('connected', function () {
  console.log('Mongoose default connection open to ' + config.DB_URL);
});

/** When the connection throws an error */
db.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

/** When the connection is disconnected */
db.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

/** If the Node process ends, close the Mongoose connection */
process.on('SIGINT', function() {
  db.close(function () {
    console.log('Mongoose default connection disconnected\
 through app termination');
    process.exit(0);
  });
});