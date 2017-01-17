'use strict';
const router = require('express').Router(), // eslint-disable-line
    userCtrl = require('../controllers/userCtrl');

module.exports = function(app) {
    app.use('/user', router); //Default route
    router.post('/', userCtrl.createUser);
    app.use('/api/user', router); // Default route with autheticated
    router.get('/', userCtrl.getUsers);
};