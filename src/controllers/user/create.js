'use strict';
const errSource = require('path').basename(__filename),
    config = require('../../config/' + process.env.NODE_ENV + '.json'),
    appVersion = process.env.VERSION,
    log = require('../../handlers/logs.js'),
    debug = require('debug')('food-app:' + errSource),
    crypto = require('crypto'),
    mongoDB = require('../../handlers/mongo/db'),
    token = require('../token');

/**
 * 
 * 
 * @param {any} userObject
 * @param {any} callback
 */
function registerUser(userObject, callback) {
    // Check this object present in the userObject before creating collection in to the MongoDB
    let checkObj = ['username', 'password'];
    checkObj.forEach(function(obj) {
        if (!userObject.hasOwnProperty(obj)) {
            return callback({
                code: 'RU0',
                statusCode: 422,
                file: errSource,
                function: 'registerUser',
                message: 'Missing ' + obj + ' filed',
                error: null,
                description: 'Missing some field which are required',
                time: new Date()
            }, null);
        }
    });
    let user = {
        username: userObject.username,
        password: hashPassword(userObject.password),
        admin: userObject.admin ? true : false,
        address: userObject.address ? userObject.address : '',
        email: userObject.email ? userObject.address : '',
        phone: userObject.phone ? userObject.address : '',
        age: userObject.age ? userObject.address : ''
    }
    mongoDB.insert('tblUser', user, (err, result) => {
        if (err) {
            return callback({
                code: 'RU1',
                statusCode: 400,
                file: errSource,
                function: 'registerUser',
                message: 'Error while inserting data in to the MongoDB',
                error: err,
                description: 'Unable to create collection in the MongoDB',
                time: new Date()
            }, null);
        }
        let userData = result.data;
        delete userData.password;
        token.genrateToken(userData, (err, userToken) => {
            if (err) {
                return callback({
                    code: 'RU2',
                    statusCode: 400,
                    file: errSource,
                    function: 'registerUser',
                    message: 'Error while genrating user authentication',
                    error: err,
                    description: 'Unable to genrate JWT token check user information for more detailes',
                    time: new Date()
                }, null);
            }
            return callback(null, {
                details: userData,
                token: userToken
            });
        });

    });
}

/**
 * 
 * 
 * @param {any} data
 * @returns
 */
function hashPassword(data) {
    return crypto.createHash('sha256').update(data).digest('base64');
}
module.exports = {
    registerUser: registerUser
}