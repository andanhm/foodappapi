'use strict';
const mongoClient = require('./mongoClient'),
    debug = require('debug')('food-app:db'),
    mongo = require('mongodb');

/**
 * Convert the string id to MongoDB document ObjectId
 *
 * @api public
 * @method
 * @param  {ObjectId()} id Return MongoDB Document ObjectId
 */
function converToMonogoObjectID(id) {
    return new mongo.ObjectID(id);
}
/**
 * Gets the MongoDB Document ObjectId created timestamp
 *
 * @api public
 * @method
 * @param  {Time} id Return MongoDB Document ObjectId created timestamp
 */
function getObjectIdTimeStamp(id) {
    return new mongo.ObjectID(id).getTimestamp();
}
/**
 * Callback for status of a collection exists.
 * @callback doesCollectionExistsCallback
 * @param {Object} error An error instance representing the error during the execution.
 * @param {Object} result The result object if the command was executed successfully.
 */
/**
 * Determines whether collection exists in MongoDB
 *
 * @api public
 * @method
 * @param  {String} collectionName Collection name need to be checked in the database
 * @param  {doesCollectionExistsCallback} callback A callback to mongodb collection exits status
 */
function doesCollectionExists(collectionName, callback) {
    let db = mongoClient.getDb();
    try {
        db.listCollections().toArray((err, collections) => {
            if (err) {
                return callback({
                    status: false
                }, null);
            }
            debug('list of collection ', collections);
            let queueCollection = [];
            collections.forEach((collectionObj) => {
                queueCollection.push(collectionObj.name);
            });
            if (queueCollection.indexOf(collectionName) > -1) {
                return callback(null, {
                    status: true
                });
            }
            return callback({
                status: false
            }, null);
        });
    } catch (err) {
        debug('collection exists ', err);
    }
}
/**
 * Callback for status of a new collection.
 * @callback createCollectionCallback
 * @param {Object} error An error instance representing the error during the execution.
 * @param {Object} result The result object if the command was executed successfully.
 */
/**
 * Creates a new collection explicitly.
 *
 * @api public
 * @method
 * @param  {String} collectionName Collection name need to be created
 * @param  {createCollectionCallback} callback A callback to mongodb collection creaction status
 */
function createCollection(collectionName, callback) {
    let db = mongoClient.getDb();
    db.createCollection(collectionName, (err, result) => {
        if (err) {
            return callback({
                status: false,
                error: err,
                message: err.message
            }, null);
        }
        return callback(null, {
            status: true,
            result: result,
            message: 'Collection created'
        });
    });
}
/**
 * Callback for status of a collection insert.
 * @callback insertCallback
 * @param {Object} error An error instance representing the error during the execution.
 * @param {Object} result The result object if the command was executed successfully.
 */
/**
 * Create a mongodb document collection
 *
 * @api public
 * @method
 * @param  {String} collection MongoDB collection name
 * @param  {JSON Object} data Data need to be added to collection
 * @param  {insertCallback} callback Callback MongoDB insert status
 */
function insert(collection, data, callback) {
    debug('Mongo Insert -> collection getDB ->', collection);
    var db = mongoClient.getDb();
    db.collection(collection).insert(data, (err, result) => {
        if (err) {
            return callback({
                status: false,
                error: err,
                message: err.message
            }, null);
        }
        let data = result.ops[0];
        if (data) {
            return callback(null, {
                status: true,
                data: data,
                message: 'Data added'
            });
        }
        return callback({
            status: false,
            error: result,
            message: 'Unable to insert data to the collection'
        }, null);

    });
}
/**
 * Callback for finding the document collection.
 * @callback findCallback
 * @param {Object} error An error instance representing the error during the execution.
 * @param {Object} result The result object if the command was executed successfully.
 */
/**
 * Selects documents in a collection and returns a cursor to the selected documents.
 *
 * @api public
 * @method
 * @param  {String} collection MongoDB collection name
 * @param  {JSON Object} data Data need to be find in the collection
 * @param  {findCallback} callback Callback Status and document of the colection.
 */
function find(collectionName, collectionData, callback) {
    var db = mongoClient.getDb();
    db.collection(collectionName).find(collectionData).toArray((err, result) => {
        if (err) {
            return callback({
                status: false,
                error: err,
                message: err.message
            }, null);
        }
        return callback(null, {
            status: true,
            result: result,
            message: 'Collection fetched successfully'
        });
    });
}
/**
 * Callback for finding one document in the collection that satisfies the specified query criteria.
 * @callback findOneCallback
 * @param {Object} error An error instance representing the error during the execution.
 * @param {Object} result The result object if the command was executed successfully.
 */
/**
 * Selects documents in a collection and returns one document that satisfies the specified query criteria
 *
 * @api public
 * @method
 * @param  {String} collection MongoDB collection name
 * @param  {JSON Object} data Data need to be find only one object in the collection
 * @param  {findOneCallback} callback Callback Status and document of the colection.
 */
function findOne(collectionName, collectionData, callback) {
    var db = mongoClient.getDb();
    db.collection(collectionName).findOne(collectionData, (err, result) => {
        if (err) {
            return callback({
                status: false,
                error: err,
                message: err.message
            }, null);
        }
        return callback(null, {
            status: true,
            result: result,
            message: 'Collection fetched successfully'
        });
    });
}
/**
 * Callback for finding one document in the collection that satisfies the specified query criteria.
 * @callback countCallback
 * @param {Object} error An error instance representing the error during the execution.
 * @param {Object} result The result object if the command was executed successfully.
 */
/**
 * Selects documents in a collection and returns one document that satisfies the specified query criteria
 *
 * @api public
 * @method
 * @param  {String} collection MongoDB collection name
 * @param  {JSON Object} data Data need to be find only one object in the collection
 * @param  {countCallback} callback Callback Status and document of the colection.
 */
function count(collectionName, collectionData, callback) {
    var db = mongoClient.getDb();
    db.collection(collectionName).find(collectionData).count((err, collectionCount) => {
        if (err) {
            return callback({
                status: false,
                error: err,
                message: err.message
            }, null);
        }
        return callback(null, {
            status: true,
            result: collectionCount,
            message: 'Fetched collection count'
        });
    });
}
/**
 * Callback for finding one document in the collection that satisfies the specified query criteria and update the document.
 * @callback updateOneCallback
 * @param {Object} error An error instance representing the error during the execution.
 * @param {Object} result The result object if the command was executed successfully.
 */
/**
 * Updates a single document within the collection based on the filter.
 *
 * @api public
 * @method
 * @param  {String} collection MongoDB collection name
 * @param  {Object} collectionData Data need to be find only one object in the collection
 * @param  {Object} updateCollectionData Data need to be updated in the collection
 * @param  {updateOneCallback} callback Return the status of the update
 */
function updateOne(collectionName, collectionData, updateCollectionData, callback) {
    var db = mongoClient.getDb();
    db.collection(collectionName).updateOne(collectionData, {
        $set: updateCollectionData
    }, (err, result) => {
        if (err) {
            return callback({
                status: false,
                error: err,
                message: err.message
            }, null);
        }
        return callback(null, {
            status: true,
            result: result,
            message: 'Collection updated successfully'
        });
    });
}
/**
 * Callback for finding documents in the collection that satisfies the specified query criteria and updates all the document.
 * @callback updateCallback
 * @param {Object} error An error instance representing the error during the execution.
 * @param {Object} result The result object if the command was executed successfully.
 */
/**
 * Updates a document within the collection based on the filter.
 *
 * @api public
 * @method
 * @param  {String} collection MongoDB collection name
 * @param  {Object} collectionData Data need to be find only one object in the collection
 * @param  {Object} updateCollectionData Data need to be updated in the collection
 * @param  {updateCallback} callback Return the status of the update
 */
function update(collectionName, collectionData, updateCollectionData, callback) {
    var db = mongoClient.getDb();
    db.collection(collectionName).updateOne(collectionData, {
        $set: updateCollectionData
    }, (err, result) => {
        if (err) {
            return callback({
                status: false,
                error: err,
                message: err.message
            }, null);
        }
        return callback(null, {
            status: true,
            result: result,
            message: 'Collection updated successfully'
        });
    });
}
/**
 * Callback for getting all the MongoDB system available collection
 * @callback listCollectionsCallback
 * @param {Object} response Fetched list status with data
 */
/**
 * Getting all the MongoDB system available collection
 *
 * @api public
 * @method
 * @param  {listCollectionsCallback} callback Return the MongoDB collection
 */
function listCollections(callback) {
    var db = mongoClient.getDb();
    db.listCollections().toArray((err, collInfos) => {
        if (err) {
            return callback({
                status: false,
                error: err,
                message: err.message
            }, null);
        }
        return callback(null, {
            status: true,
            result: collInfos,
            message: 'Fetched all collection successfully'
        });
    });
}
/**
 * Callback for fetching documents in the collection that satisfies the specified query criteria
 * @callback aggregateCallback
 * @param {Object} error An error instance representing the error during the execution.
 * @param {Object} result The result object if the command was executed successfully.
 */
/**
 * Pipeline stages appear in an array.
 *
 * @api public
 * @method
 * @param  {String} collectionName MongoDB collection name
 * @param  {Object} aggregateCondition MongoDB Query
 * @param  {aggregateCallback} callback Return the array aggregated data
 */
function aggregate(collectionName, aggregateCondition, callback) {
    var db = mongoClient.getDb();
    db.collection(collectionName).aggregate(aggregateCondition, (err, result) => {
        if (err) {
            return callback({
                status: false,
                error: err,
                message: err.message
            }, null);
        }
        return callback(null, {
            status: true,
            result: result,
            message: 'Aggregate data fetched successfully'
        });
    });
}
/**
 * Callback for dropping the database
 * @callback dropDatabaseCallback
 * @param {Object} error An error instance representing the error during the execution.
 * @param {Object} result The result object if the command was executed successfully.
 */
/**
 * Drops the database from the MongoDB
 *
 * @api public
 * @method
 * @param  {dropDatabaseCallback} callback The drop collection result callback
 */
function dropDatabase(callback) {
    var db = mongoClient.getDb();
    db.dropDatabase((err, result) => {
        if (err) {
            return callback({
                status: false,
                error: err,
                message: err.message
            }, null);
        }
        return callback(null, {
            status: true,
            result: result,
            message: 'Database drop successfully'
        });
    });
}
/**
 * Callback for dropping the database collection from the MongoDB
 * @callback dropCollectionCallback
 * @param {Object} error An error instance representing the error during the execution.
 * @param {Object} result The result object if the command was executed successfully.
 */
/**
 * Drops the database from the MongoDB
 *
 * @api public
 * @method
 * @param  {dropCollectionCallback} callback The drop collection result callback
 */
function dropCollection(name, callback) {
    var db = mongoClient.getDb();
    db.collection(name, (err, collection) => {
        if (err) {
            return callback({
                status: false,
                error: err,
                message: err.message
            });
        }
        collection.drop((err, result) => {
            if (err) {
                return callback({
                    status: false,
                    error: err,
                    message: err.message
                });
            }
            return callback(null, {
                status: true,
                result: result
            });
        });
    });
}

function emptyCollection(name, callback) {
    var db = mongoClient.getDb();
    db.collection(name, (err, collection) => {
        if (err) {
            return callback({
                status: false,
                error: err,
                message: err.message
            });
        }
        collection.remove({}, (err, result) => {
            if (err) {
                return callback({
                    status: false,
                    error: err,
                    message: err.message
                });
            }
            return callback(null, {
                status: true,
                result: result
            });
        });
    });
}

module.exports = {
    converToMonogoObjectID: converToMonogoObjectID,
    getObjectIdTimeStamp: getObjectIdTimeStamp,
    doesCollectionExists: doesCollectionExists,
    createCollection: createCollection,
    insert: insert,
    find: find,
    findOne: findOne,
    count: count,
    update: update,
    updateOne: updateOne,
    aggregate: aggregate,
    listCollections: listCollections,
    dropDatabase: dropDatabase,
    dropCollection: dropCollection,
    emptyCollection: emptyCollection
};