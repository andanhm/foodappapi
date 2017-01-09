'use strict';
var moment = require('moment');
/**
 * Converts the Milliseconds to human readable format using moment.js (hh:mm:ss)
 * @param  {number} ms Milliseconds that need to coverted
 */
function formatTime(milliSeconds) {
    var date = new Date().getTime() + milliSeconds
      , momentObj = moment(new Date(date), ['h:mm:ss A']);
    return momentObj.format('h:mm:ss A');
}
/**
 * Converts the Milliseconds to human readable format using moment.js (hh:mm:ss)
 * @param  {number} ms Milliseconds that need to coverted
 */
function convertMillisecondsToDigitalClock(milliSeconds) {
    var mm = moment.duration(milliSeconds)
      , hours = mm.hours()
      , minutes = mm.minutes()
      , seconds = mm.seconds();
    hours = (hours > 9) ? hours : '0' + hours;
    minutes = (minutes > 9) ? minutes : '0' + minutes;
    seconds = (seconds > 9) ? seconds : '0' + seconds;
    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        arrivalTime: formatTime(milliSeconds),
        clock: hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds'
    };
}

/**
 * Returns instance of momentjs to current date is ISO format 2016-12-15T22:12:49.203Z
 */
function now() {
    return moment().toISOString();
}
module.exports = {
    now: now,
    convertMillisecondsToDigitalClock: convertMillisecondsToDigitalClock
};