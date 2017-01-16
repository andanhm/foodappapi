'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Create a user schema
var LogSchema = new Schema({
    serverName: String,
    username: String,
    opType: String,
    version: String,
    timestamp: Date
});

// Make this available to our users in our Node applications
module.exports = mongoose.model('Log', LogSchema);