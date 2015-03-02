var Snoocore = require('snoocore');
var when = require('when');
var config = require('./config.json');
var open = require('open');
var mongoose = require('mongoose');
var RedditApp = require('../models/redditApp.js');
var crypto = require('crypto');
var REDDIT_CONSUMER_KEY = "Gpy69vUdPU_-MA";
var REDDIT_CONSUMER_SECRET = "zlcuxzzwfexoVKpYatn_1lfZslI";

var accounts = {};
var redditPlus = new Snoocore(config.appConfig);

function newRedditInstance() {
    var reddit = new Snoocore(config.userConfig);
    return reddit;
}

function getRedditInstance(refreshToken) {
    if (accounts[refreshToken]) {
        return when.resolve(accounts[refreshToken]);
    }
    console.log('[REDDIT API] ' + 'creating new snoocore instance...');
    var reddit = newRedditInstance();
    console.log('[REDDIT API] ' + 'creatied new snoocore instance, attempting refresh...' + refreshToken);
    return reddit.refresh(refreshToken).then(function(){
        console.log('new snoocore instance created..');
        accounts[refreshToken] = reddit;
        console.log('new snoocore instance saved..');
        //set timeout see line 85 https://github.com/trevorsenior/recomm/blob/86918d9f966d801a683494a4d3ed473e87fa36ab/server/server.js#L39
        return reddit;
    });
}

//Authenticated subreddits call.
exports.subredditsUser = function(refreshToken, callback) {
    console.log('[REDDIT API] ' + 'subredditsUser');
    getRedditInstance(refreshToken).then(function(reddit){
            console.log('[REDDIT API] ' + 'snoocore instance retrieved/created');
            reddit('/subreddits/mine/subscriber').get().then(function(data){
                console.log('[SUBREDDITS/MINE] ' + data);
                callback(data);
            });
    });
}

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

function printSlice(slice) {
    slice.stickied.forEach(function(item, i) {
        console.log('**STICKY**', item.data.title.substring(0, 20) + '...');
    });

    slice.children.forEach(function(child, i) {
        console.log(slice.count + i + 1, child.data.title.substring(0, 20) + '...');
    });
}

// http://tsenior.com/snoocore/events.html
// reddit.on('access_token_expired', function() {
//   // do something, such as re-authenticating the user with reddit
//   RedditApp.findOne({}, function(err, data){
//     if (err) throw new error(err);
//     if (data) {
//         reddit.refresh(data.refreshToken).then(function(){
//             console.log('We are now RE!authenticated!');
//         });
//     } else {
//         //[401] instead here maybe error because no refersh token found or initiate auth again...
//         //try a redirect to '/' to reinitiate auth.. 
//         console.log('error when trying to reauthenticate using refresh token');
//         redirect('/');
//     }
// });

var state = crypto.randomBytes(32).toString('hex');

// [401] CALL THIS AGAIN WHEN ACCESS TOKEN EXPIRES AND WE NEED SNOOCORE TO REFRESH...
RedditApp.findOne({}, function(err, data){
    if (err) throw new error(err);
    if (data) {
        redditPlus.refresh(data.refreshToken).then(function(){
            console.log('We are now authenticated!');
        });
    } else {
        //[401] instead here maybe error because no refersh token found or initiate auth again...
        //try a redirect to '/' to reinitiate auth.. 
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