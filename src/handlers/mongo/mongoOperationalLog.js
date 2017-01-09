'use strict';
var errSource = require('path').basename(__filename),
    mongoDB = require('./db'),
    time = require('../../controllers/utilities/time'),
    serverName = require('os').hostname(),
    debug = require('debug')('foodapp:' + errSource),
    appVersion = process.env.VERSION;
/**
 * Callback for logging MongoDB operations
 *
 * @callback logItCallback
 * @param  {Object} error Return if any required object missing / Error entering to the mongoDB
 * @param  {Object} result Acknowledges status of the log entery
 *  */
/**
 * Function to format text which needs to be written in to the MongoDB
 *
 * @param  {Object} logObj Operational log that need to be added to the MongoDB
 * @param  {String} logObj.queueName The name of the queue.
 * @param  {String} logObj.opType The MongoDB operational type (Create,Delete,Update).
 * @param  {String} logObj.requestUrl Request Url to indentify the which host requested
 * @param  {logItCallback} callback Callback for operational log entery
 */
function logIt(logObj, callback) {
    var checkObj = ['queueName', 'opType', 'requestUrl']; // Check this object present in the logObj before logging to the MongoDB
    checkObj.forEach(function(obj) {
        if (!logObj.hasOwnProperty(obj)) {
            return callback({
                status: false,
                code: 'LIT0',
                file: errSource,
                function: 'enterOpertionalLog',
                message: 'Missing ' + obj + ' filed',
                error: null,
                description: 'Missing some field which are required to log the operations',
                time: time.now()
            }, null);
        }
    });
    var collectionName = 'queueLogs',
        loggerObj = {
            timestamp: time.now(),
            serverName: serverName,
            operationalType: logObj.opType,
            queueName: logObj.queueName,
            requestUrl: logObj.requestUrl,
            version: appVersion
        };
    debug('MongoDB operational log %s ', JSON.stringify(loggerObj));
    mongoDB.insert(collectionName, loggerObj, function(err, result) { // Inset data in to the queueLogs collection
        debug('MongoDB insert operational log error %s result %s', JSON.stringify(err), JSON.stringify(result));
        if (err) {
            return callback({
                status: false,
                code: 'LIT1',
                file: errSource,
                function: 'enterOpertionalLog',
                message: 'Missing went wrong in logging to MongoDB',
                error: JSON.stringify(err),
                description: 'Missing went wrong in logging to MongoDB',
                time: time.now()
            }, null);
        }
        return callback(null, {
            status: true,
            message: 'MongoDB operation log'
        });
    });
}

module.exports = {
    logIt: logIt
};