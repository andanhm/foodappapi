'use strict';
var errSource = require('path').basename(__filename),
    appDetails = require('../package.json'),
    log = require('../handlers/logs.js'),
    router = require('express').Router();

module.exports = function(app) {
    app.use('/v2/user', router); //Default route
};