var Snoocore = require('snoocore');
var when = require('when');
var config = require('./config.json');
var open = require('open');
var RedditApp = require('../models/redditApp.js');
var crypto = require('crypto');
var redditAuth = require('./redditAuth');
var redditServer = require('./redditServer');

/**
 * REDDIT API CALLS
 */

/*
    Authenticated Api Calls.
 */

exports.subredditsUser = function(generatedState, callback) {
    redditAuth.getInstance(generatedState).then(function(reddit){
        reddit('/subreddits/mine/subscriber').get().then(function(data){
            callback(data);
        });
    });
};

exports.me = function(generatedState, callback) {
    redditAuth.getInstance(generatedState).then(function(reddit){
        reddit('/api/v1/me').get().then(function(data){
            callback(data);
        });
    });
};

/*
    UnAuthenticated Api Calls.
 */

exports.subreddit = function(sub, sort, postLimit, after, callback) {
    redditServer.getRedditServer().then(
        function(reddit) {
            reddit('r/$subreddit/$sort').listing({
            $subreddit: sub,
            limit: postLimit,
            after: after,
            $sort: sort
            }).then(
                function(slice) {
                    callback(slice);
                }
            );
        }
    );
};

exports.subreddits = function (callback) {
    redditServer.getRedditServer().then(function(reddit) {
        reddit('/subreddits/popular').get().then(function(data) {
            callback(data);
        });
    });
};