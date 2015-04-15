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

exports.subredditUser = function(generatedState, sub, sort, postLimit, after, t, callback) {
	redditAuth.getInstance(generatedState).then(
		function(reddit) {
			reddit('r/$subreddit/$sort').listing({
			$subreddit: sub,
			t: t,
			limit: postLimit,
			after: after,
			$sort: sort
			}).then(
				function(data) {
					callback(data);
				}
			);
		}
	);
};

exports.save = function(generatedState, id, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit){
		reddit('/api/save').post({
			id: id
		}).then(function(data) {
			callback(data);
		});
	});
};

exports.unsave = function(generatedState, id, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit){
		reddit('/api/unsave').post({
			id: id
		}).then(function(data) {
			callback(data);
		});
	});
};

exports.vote = function(generatedState, id, dir, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit){
		reddit('/api/vote').post({
			id: id,
			dir: dir
		}).then(function(data){
			callback(data);
		});
	});
};

exports.subredditsUser = function(generatedState, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit){
		reddit('/subreddits/mine/subscriber').listing({
			limit: 100
		}).then(function(data){
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

exports.subreddit = function(sub, sort, postLimit, after, t, callback) {
	redditServer.getRedditServer().then(
		function(reddit) {
			reddit('r/$subreddit/$sort').listing({
			$subreddit: sub,
			t: t,
			limit: postLimit,
			after: after,
			$sort: sort
			}).then(
				function(data) {
					callback(data);
				}
			);
		}
	); 
};

exports.subreddits = function (callback) {
	redditServer.getRedditServer().then(function(reddit) {
		reddit('/subreddits/popular').listing({
			limit: 50
		}).then(function(data) {
			callback(data);
		});
	});
};

exports.comments = function(subreddit, article, sort, callback) {
	redditServer.getRedditServer().then(function(reddit) {
		reddit('r/$subreddit/comments/$article').get({
			$subreddit: subreddit,
			$article: article,
			context: 0,
			// depth: 5,
			showedits: false,
			showmore: false,
			sort: sort
		}).then(function(data) {
			console.log('<<COMMENTS>>'+JSON.stringify(data));
			callback(data);
		});
	});
};