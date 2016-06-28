var Snoocore = require('snoocore');
var when = require('when');
var open = require('open');
// var config = require('./config.json');
var config = require('../common.js').config();
var RedditApp = require('../models/redditApp');
var crypto = require('crypto');
var winston = require('winston');

var serverGeneratedState = crypto.randomBytes(32).toString('hex');
var redditServer;
var serverTimeout = 59 * 60 * 1000;

refreshServer();

// RedditApp.findOne({}, function(err, data){
//     if (err) throw new error(err);
//     if (data) {
//         redditServer.refresh(data.refreshToken).then(function(){
//             //console.log('We are now authenticated!');
//         });
//     } else {
//         open(redditServer.getExplicitAuthUrl(serverGeneratedState));
//     }
// });

exports.getRefreshToken = function(req, res, next, callback) {
    RedditApp.findOne({}, function(err, data) {
        if (err) next(err);
        if (data) {
            callback(data.refreshToken);
        }
    });
};

exports.getRedditServer = function(req, res, next, callback) {
    if (redditServer !== null && typeof(redditServer) !== 'undefined') {
        when.resolve(redditServer).then(function(reddit) {
            callback(reddit);
        });
    } else {

        redditServer = new Snoocore(config.serverConfig);

        RedditApp.findOne({}, function(err, data) {
            if (err) next(err);
            if (data) {
                redditServer.refresh(data.refreshToken).then(function() {
                    //console.log('Reddit server authenticated.');
                    when.resolve(redditServer).then(function(reddit) {
                        callback(reddit);
                    });
                });
            } else {
                open(redditServer.getExplicitAuthUrl(serverGeneratedState));
            }
        });
    }
};

exports.completeServerAuth = function(returnedState, code, error, callback) {

    if (serverGeneratedState !== returnedState) {
        //console.log("Error states do not match...");
        winston.error('Server Generated State:', serverGeneratedState);
        winston.error('Returned State:', returnedState);
    }
    redditServer.auth(code).then(function(refreshToken) {
        //console.log("[completeAuthorization] refresh token: " + refreshToken);

        setTimeout(function() {
            //console.log('SERVER TIMEOUT');
            refreshServer();
        }, serverTimeout);

        RedditApp.findOne({}, function(err, data) {
            if (err) throw new error(err);
            if (data) {
                data.refreshToken = refreshToken;
                data.save(function(err) {
                    if (err) throw new error(err);
                    callback();
                });
            } else {
                var newRedditApp = new RedditApp();
                newRedditApp.refreshToken = refreshToken;
                newRedditApp.save(function(err) {
                    if (err) throw new error(err);
                    callback();
                });
            }
        });
    });
};

/*
	Refreshes the server snoocore object using the saved refresh token
	Use when you get a 401 response from reddit indicating the access token has expired.
 */
function refreshServer() {

    redditServer = new Snoocore(config.serverConfig);

    RedditApp.findOne({}, function(err, data) {
        if (err) throw new error(err);
        if (data) {
            redditServer.refresh(data.refreshToken).then(function() {
                //console.log('Reddit server authenticated.');
            }).catch(function(ResponseError) {
                //console.log('[redditServer] refreshServer(), error');
                winston.log('error', ResponseError);
            });
        } else {
            open(redditServer.getExplicitAuthUrl(serverGeneratedState));
        }
    });

    setTimeout(function() {
        //console.log('SERVER TIMEOUT');
        refreshServer();
    }, serverTimeout);
}
