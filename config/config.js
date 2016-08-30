// ./environments/config.js

// gets the value of environment and puts it in a variable
var NODE_ENV = process.env.NODE_ENV || 'development';

// load the config file for the current process environment
var config = require('./environments/' + NODE_ENV);

module.exports = config;