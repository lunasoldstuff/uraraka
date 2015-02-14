var mongodb = require('mongodb');
var mongoClient = require('mongodb').MongoClient;

var mongoUri = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/redditplus';

var connectionInstance;

module.exports = function(callback) {
    if (connectionInstance) {
        callback(connectionInstance, function(error) {
            if (error) {
                console.log(error);
            } else {
                // connectionInstance.close();
            }
        });
        return;
    }

    mongoClient.connect(mongoUri,
        function(error, db) {
            if (error) {
                console.log("error opening db connection");
                console.log(error);
                // connectionInstance.close();
            } else {
                connectionInstance = db;
                callback(connectionInstance, function(error) {
                    if (error) {
                        console.log(error);
                    } else {
                        // connectionInstance.close();
                    }
                });
            }
        }
    );
}
