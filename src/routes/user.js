'use strict';
var errSource = require('path').basename(__filename)
  , log = require('../handlers/logs.js') 
  , router = require('express').Router(); // eslint-disable-line

module.exports = function(app) {
    app.use('/v2/user', router); //Default route
};