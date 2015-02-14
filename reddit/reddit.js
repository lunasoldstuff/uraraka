var Snoocore = require('snoocore');
var when = require('when');
var config = require('./config.json');
var open = require('open');
var database = require('../database/database');

var reddit = new Snoocore({
    userAgent: 'Snoocore Examples GitHub: https://github.com/trevorsenior/snoocore-examples',
    oauth: {
        type: 'explicit',
        duration: 'permanent', // will allow us to authenticate for longer periods of time
        consumerKey: config.oauthExplicit.consumerKey,
        consumerSecret: config.oauthExplicit.consumerSecret,
        redirectUri: config.oauthExplicit.redirectUri,
        scope: ['read']
    }
});

// used to prevent CSRF... use something better than this!
var state = String(Math.ceil(Math.random() * 1000, 10));

database.getRefreshToken(function(results){
    if (results.length > 0) {
        console.log("Using stored refresh token: " + results[0].refreshToken);

        reddit.refresh(results[0].refreshToken).then(function(){
            console.log('\n\nWe are now authenticated!\n');
        });
    } else {
        open(reddit.getAuthUrl(state));
    }
});

exports.completeAuthorization = function(returnedState, code, error) {
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
    reddit.auth(code).then(function(refreshToken){
        console.log("refresh token: " + refreshToken);
        database.saveRefreshToken(refreshToken, function(data) {
            "Refresh Token Saved."
            console.log(data);
        });

    });
}
asdfasdf;

exports.subreddit = function(sub, sort, postLimit, callback) {
    reddit('/r/$subreddit/$sort').listing({
        $subreddit: sub,
        limit: postLimit,
        $sort: sort
    }).then(function(slice) {
        callback(slice);
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