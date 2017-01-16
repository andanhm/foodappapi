'use strict';
const router = require('express').Router(), // eslint-disable-line
    userCtrl = require('../controllers/user/fetch'); // eslint-disable-line

module.exports = function(app) {
    app.use('/v2/user', router); //Default route
    router.get('/', )
};