'use strict';
const errSource = require('path').basename(__filename),
    appPackage = require('../package.json'),
    debug = require('debug')('q-man:' + errSource),
    appVersion = process.env.VERSION;

/**
 * To format date time to desired format :- '20 Feb 2013 @ 3:46 PM'
 */
function getLogDate() {
    let currentTime = new Date(),
        month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        date = currentTime.getDate() + ' ' + month[currentTime.getMonth()] + ' ' + currentTime.getFullYear(),
        suffix = 'AM',
        hours = currentTime.getHours(),
        minutes = currentTime.getMinutes();

    minutes = (minutes < 10) ? '0' + minutes : minutes;
    if (hours >= 12) {
        suffix = 'PM';
        hours = hours - 12;
    }
    if (hours === 0) {
        hours = 12;
    }
    return date + ' @ ' + hours + ':' + minutes + ' ' + suffix;
}

/**
 * Function to format text which needs to be written in the text file
 *
 * @param  {String} errorCode Unique error code for identification
 * @param  {String} source From where the error occured
 * @param  {String} methodName Method / Function name
 * @param  {String} statement Error message
 * @param  {String} description Detail description of the error message
 * @param  {String} reference Reference of error
 */
function enterErrorLog(errorCode, source, methodName, statement, description, reference) {
    var errorCode = errorCode ? errorCode : '',
        source = source ? source : '',
        methodName = methodName ? methodName : '',
        statement = statement ? statement : '',
        description = description ? description : '',
        reference = reference ? reference : '',
        serverName = serverName ? serverName : require('os').hostname(),
        appName = appName ? appName : appPackage.name

    var logObj = {
        logDate: getLogDate(),
        errorCode: appPackage.name + '-' + errorCode,
        serverName: serverName,
        appName: appName,
        source: source,
        methodName: methodName,
        statement: statement,
        description: description,
        reference: reference,
        version: appVersion,
    };
    debug('Enter Error Log %s ', JSON.stringify(logObj));
}

module.exports = {
    enterErrorLog: enterErrorLog
};