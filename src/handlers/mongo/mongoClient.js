'use strict';
var mongodb = require('mongodb'),
    qManConfig = require('../../config/' + process.env.NODE_ENV + '.json'),
    MongoClient = mongodb.MongoClient,
    debug = require('debug')('foodapp:mongodb');

/**
 * Get the MongoDB connect URI fromat for connection
 *
 * @example
 * mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
 * @see {@link https://docs.mongodb.com/manual/reference/connection-string/|MongoDB}
 */
function getMongoDBUri() {
    var host = qManConfig.mongodb.host,
        port = qManConfig.mongodb.port,
        dbName = qManConfig.mongodb.name,
        username = qManConfig.mongodb.username,
        password = qManConfig.mongodb.password,
        mongoDBUri = 'mongodb://' + username + ':' + password + '@' + host + ':' + port + '/' + dbName, // Remote MongoDB URI with username and password
        mongoDBUri = 'mongodb://' + host + ':' + port + '/' + dbName; // For local env MongoDB Uri with out username and password
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
        mongos: true
    };
    MongoClient.connect(getMongoDBUri(), mongoOption, function(err, db) {
        if (err) {
            return callback(err);
        }
        debug('New connection to MongoDB %s ', qManConfig.mongodb.dbname);
        _db = db;
    });
}

module.exports = {
    connect: connect
};