'use strict';
const mongodb = require('mongodb')
    , foodAppConfig = require('../../config/' + process.env.NODE_ENV + '.json')
    , MongoClient = mongodb.MongoClient
    , debug = require('debug')('foodapp:mongodb');

/**
 * Get the MongoDB connect URI fromat for connection
 *
 * @example
 * mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
 * @see {@link https://docs.mongodb.com/manual/reference/connection-string/|MongoDB}
 */
function getMongoDBUri() {
    let host = foodAppConfig.mongodb.host
      , port = foodAppConfig.mongodb.port
      , dbName = foodAppConfig.mongodb.name
      , username = foodAppConfig.mongodb.username
      , password = foodAppConfig.mongodb.password
//      , mongoDBUri = 'mongodb://' + username + ':' + password + '@' + host + ':' + port + '/' + dbName // Remote MongoDB URI with username and password
      , mongoDBUri = 'mongodb://' + host + ':' + port + '/' + dbName; // For local env MongoDB Uri with out username and password
    return mongoDBUri;
}

var _db = {};
/**
 * Callback error details if unable to connect the MongoDB
 * @callback connectCallback
 * @param {Object} err MongoDB error object stacks
 */
/**
 * Connect method to connect to the mongodb server
 *
 * @api public
 * @method
 * @param  {connectCallback} callback - A callback to MongoDB connection error details
 */
function connect(callback) {
    var mongoOption = {
        db: {
            'native_parser': false
        },
        server: {
            'auto_reconnect': true,
            socketOptions: {
                connectTimeoutMS: 500
            }
        },
        replSet: {},
        mongos: {}
    };
    MongoClient.connect(getMongoDBUri(), mongoOption, function(err, db) {
        if (err) {
            return callback(err);
        }
        debug('New connection to MongoDB %s ', foodAppConfig.mongodb.name);
        _db = db;
    });
}

module.exports = {
    connect: connect
};