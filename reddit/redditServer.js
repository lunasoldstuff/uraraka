var Snoocore = require('snoocore');
var when = require('when');
var open = require('open');
// var config = require('./config.json');
var config = require('../common.js').config();
var crypto = require('crypto');
var winston = require('winston');

var serverGeneratedState = crypto.randomBytes(32).toString('hex');
var redditServer;
var serverTimeout = 59 * 60 * 1000;

redditServer = new Snoocore(config);


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

exports.getRedditServer = function(req, res, next, callback) {
	if (redditServer !== null && typeof(redditServer) !== 'undefined') {
		when.resolve(redditServer).then(function(reddit) {
			callback(reddit);
		});
	} else {

		redditServer = new Snoocore(config);

		when.resolve(redditServer).then(function(reddit) {
			callback(reddit);
		});

	}
};

/*
	Refreshes the server snoocore object using the saved refresh token
	Use when you get a 401 response from reddit indicating the access token has expired.\

    Application Only OAuth update.. 
    Not sure if refreshing the token is necessary in App only oauth. 
    I'll leave this method here for now, but it is not being used.

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