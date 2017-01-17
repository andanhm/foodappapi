'use strict';
const mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    foodAppConfig = require('../../config/' + process.env.NODE_ENV + '.json'),
    debug = require('debug')('food-app:mongodb');

/**
 * Get the MongoDB connect URI fromat for connection
 *
 * @example
 * mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
 * @see {@link https://docs.mongodb.com/manual/reference/connection-string/|MongoDB}
 */
function getMongoDBUri() {
    let host = foodAppConfig.mongodb.host,
        port = foodAppConfig.mongodb.port,
        dbName = foodAppConfig.mongodb.name,
        username = foodAppConfig.mongodb.username,
        password = foodAppConfig.mongodb.password,
        // mongoDBUri = 'mongodb://' + username + ':' + password + '@' + host + ':' + port + '/' + dbName, // Remote MongoDB URI with username and password
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
function connect() {
    let mongoOption = {
            db: {
                'native_parser': false
            },
            server: {
                poolSize: 5,
                'auto_reconnect': true,
                socketOptions: {
                    connectTimeoutMS: 500
                }
            },
            replSet: {},
            mongos: {}
        },
        dbURI = getMongoDBUri();
    MongoClient.connect(dbURI, mongoOption, (err, db) => {
        if (err) {
            debug('MongoDB connection err');
        }
        debug('MongoDB connected');
        _db = db;
    });
}

/**
 * Return MongoDB database object
 *
 * @api public
 * @method
 * @returns {Object} returns The **Collection** class is an internal class that embodies a MongoDB collections
 */
function getDb() {
    return _db;
}
module.exports = {
    connect: connect,
    getDb: getDb
};