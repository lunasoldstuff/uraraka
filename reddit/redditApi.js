var Snoocore = require('snoocore');
var when = require('when');
var config = require('./config.json');
var open = require('open');
var mongoose = require('mongoose');
var RedditApp = require('../models/redditApp.js');
var crypto = require('crypto');

var accounts = {};
var redditPlus = new Snoocore(config.appConfig);

/*
    REDDIT CALLS.
*/

//Authenticated reddit api calls.
exports.subredditsUser = function(refreshToken, callback) {
    getRedditInstance(refreshToken).then(function(reddit){
            reddit('/subreddits/mine/subscriber').get().then(function(data){
                callback(data);
            });
    });
}

//Regualar api calls.
exports.subreddit = function(sub, sort, postLimit, callback) {
    redditPlus('r/$subreddit/$sort').listing({
        $subreddit: sub,
        limit: postLimit,
        $sort: sort
    }).then(function(slice) {
        callback(slice);
    });
}

exports.subreddits = function (callback) {
    redditPlus('/subreddits/popular').get().then(function(data){
        // console.log(data);
        callback(data);
    });
}

function newRedditInstance() {
    var reddit = new Snoocore(config.userConfig);
    return reddit;
}

function getRedditInstance(refreshToken) {
    if (accounts[refreshToken]) {
        return when.resolve(accounts[refreshToken]);
    }
    var reddit = newRedditInstance();
    return reddit.refresh(refreshToken).then(function(){
        accounts[refreshToken] = reddit;
        //set timeout see line 85 http://tinyurl.com/orzznfp
        return reddit;
    });
}


function printSlice(slice) {
    slice.stickied.forEach(function(item, i) {
        console.log('**STICKY**', item.data.title.substring(0, 20) + '...');
    });

    slice.children.forEach(function(child, i) {
        console.log(slice.count + i + 1, child.data.title.substring(0, 20) + '...');
    });
}

/*
    Initialize the Web app's Snoocore Instance.
*/

var state = crypto.randomBytes(32).toString('hex');

RedditApp.findOne({}, function(err, data){
    if (err) throw new error(err);
    if (data) {
        redditPlus.refresh(data.refreshToken).then(function(){
            console.log('We are now authenticated!');
        });
    } else {
        open(redditPlus.getAuthUrl(state));
    }
});

exports.completeAuthorization = function(returnedState, code, error, callback) {
    console.log("[completeAuthorization] state: " + state + ", code: " + code);
    if (error) {
        console.log("Error occurred during authorization");
        console.error(error);
    }
    if (state !== returnedState) {
        console.log("Error states do not match...")
        console.error('Generated State:', state);
        console.error('Returned State:',returnedState);
    }
    redditPlus.auth(code).then(function(refreshToken){
        console.log("[completeAuthorization] refresh token: " + refreshToken);
        
        RedditApp.findOne({}, function(err, data) {
            if (err) throw new error(err);
            if (data) {
                data.refreshToken = refreshToken;
                data.save(function(err){
                    if (err) throw new error(err);
                    callback();
                });
            }
            else {
                var newRedditApp = new RedditApp();
                newRedditApp.refreshToken = refreshToken;
                newRedditApp.save(function(err){
                    if (err) throw new error(err);
                    callback();
                });
            }
        })
    });
}