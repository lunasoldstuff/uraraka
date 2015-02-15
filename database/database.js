/**
 * Created by Jalal on 2/14/2015.
 */
var mongoSingleton = require('./mongoSingleton');

exports.saveRefreshToken = function(refreshToken, callback) {
    
    mongoSingleton(function (db) {
        db.collection('reddit_auth').find({}).toArray(function (err, docs) {
            if (err) {
                console.log("Error retrieving refresh token.");
                console.error(err);
            }

            if (docs.length > 0) {
                console.log("[DATABASE] Updating existing token.");
                db.collection('reddit_auth').update(
                    {_id: docs[0]._id},
                    {refreshToken: refreshToken},
                    function (err, result) {
                        if (err) {
                            console.log("error updating document");
                            console.error(err);
                        } else {
                            console.log("update successful");
                        }
                    });

            } else {
                
                db.collection('reddit_auth').save(
                    {
                        refreshToken: refreshToken
                    },
                    {safe: true},
                    function (error, doc) {
                        if (error) {
                            console.log("error saving refresh token");
                            console.error(error);
                        }
                        else {
                            console.log("[DATABASE] Refresh token saved.");
                            console.log(doc);
                            if (callback) callback(doc);
                        }
                    });
            }
        });
    });
}

exports.getRefreshToken = function(callback) {
    mongoSingleton(function(db){
        db.collection('reddit_auth').find({}).toArray(function(err, docs){
            if (err) {
                console.log("Error retrieving refresh token.");
                console.error(err);
            }
            console.log("[DATABASE] docuemnts found: " + docs.length);
            callback(docs);
        });
    });
}