'use strict';
var url = require('url');
/**
 * Gets the request url from the http express request param
 * @param  {Object} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers
 */
function formatRequestUrl(req) {
    return url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    });
}
module.exports = {
    formatRequestUrl: formatRequestUrl
};