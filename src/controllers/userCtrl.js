'use strict';
const errSource = require('path').basename(__filename),
    appPackage = require('../package.json'),
    appVersion = process.env.VERSION,
    mongoDB = require('../handlers/mongo/db'),
    debug = require('debug')('food-app:' + errSource);

function getUsers(req, res) {
    mongoDB.find('tblUser', {}, (err, result) => {
        if (err) {
            return res.status(err.statusCode | 400).type('json').send({
                error: err,
                data: {},
                version: appVersion
            });
        }
        return res.status(200).type('json').send({
            error: {},
            data: result,
            version: appVersion
        });
    });
}

function createUser(req, res) {
    let data = req.body;
    require('./user/create').registerUser(data, function(err, result) {
        if (err) {
            return res.status(err.statusCode | 400).type('json').send({
                error: err,
                data: {},
                version: appVersion
            });
        }
        return res.status(201).type('json').send({
            error: {},
            data: result,
            version: appVersion
        });
    });
}
module.exports = {
    createUser: createUser,
    getUsers: getUsers
}