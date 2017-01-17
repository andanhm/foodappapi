'use strict';
const errSource = require('path').basename(__filename),
    jwt = require('jsonwebtoken'),
    debug = require('debug')('food-app:' + errSource),
    secert = process.env.SECERT ? process.env.SECERT : 'foodapp';
/**
 * Callback for token genration with error, token
 *
 * @callback genrateTokenCallback
 * @param  {Object} error Return if any required object missing / Error genrating JWT token
 * @param  {Object} result Genrated token
 *  */
/**
 * Generats the token for user authenticating
 *
 * @param  {Object} data Set the payload that need to be encoded
 * @param  {genrateTokenCallback} callback Callback for operational log entery
 */
function genrateToken(data, callback) {
    try {
        jwt.sign({
            data
        }, secert, {
            algorithm: 'HS256'
        }, (err, token) => {
            debug('')
            if (err) {
                return callback({
                    code: 'GT0',
                    file: errSource,
                    function: 'genrateToken',
                    message: 'Genrating token got error',
                    error: err,
                    time: new Date()
                }, null);
            }
            return callback(null, token)
        });
    } catch (err) {
        return callback({
            code: 'GT01',
            file: errSource,
            function: 'genrateToken',
            message: 'Unhandled execption in token genrating',
            error: err,
            time: new Date()
        }, null);
    }

}

/**
 * isVaildToken Verifies the token
 * @param  {String}  token  Token that need to be verified
 * @param  {Boolean}  status Return the status of the token
 */
/**
 * Callback for token verfication with error, token
 *
 * @callback isVaildTokenCallback
 * @param  {Object} error Return if any required object missing / Error decoded JWT token
 * @param  {Object} decoded Decoded token
 *  */
/**
 * isVaildToken Verifies the token
 *
 * @param  {String} token User token that need to be verified
 * @param  {isVaildTokenCallback} callback Callback for token verfication
 */

function isVaildToken(token, callback) {
    try {
        jwt.verify(token, secert, (err, decoded) => {
            if (err) {
                return callback({
                    code: 'VT01',
                    file: errSource,
                    function: 'isVaildToken',
                    message: 'Unhandled execption in varifing token',
                    error: err,
                    time: new Date()
                }, null);
            }
            return callback(null, decoded);
        });

    } catch (err) {
        return callback({
            code: 'VT01',
            file: errSource,
            function: 'isVaildToken',
            message: 'Unhandled execption in varifing token',
            error: err,
            time: new Date()
        }, null);
    }
}
module.exports = {
    genrateToken: genrateToken,
    isVaildToken: isVaildToken
}