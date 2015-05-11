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

exports.me = function(generatedState, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit){
		reddit('/api/v1/me').get().then(function(data){
			callback(data);
		});
	});
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

exports.userUser = function(generatedState, username, where, sort, limit, after, t, callback) {
	redditAuth.getInstance(generatedState).then(
		function(reddit) {
			reddit('/user/$username/$where').listing({
				$username: username,
				$where: where,
				sort: sort,
				limit: limit,
				after: after,
				t: t
			}).then(
				function(data) {
					callback(data)
				}
			);
		}
	);
}

exports.commentsUser = function(generatedState, subreddit, article, sort, comment, context, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('r/$subreddit/comments/$article').get({
			$subreddit: subreddit,
			$article: article,
			comment: comment,
			context: context,
			// depth: 5,
			showedits: false,
			showmore: true,
			sort: sort
		}).then(function(data) {
			callback(data);
		});
	});
};

exports.moreChildrenUser = function(generatedState, link_id, children, sort, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/morechildren').get({
			link_id: link_id,
			children: children,
			sort: sort
		}).then(function(data) {
			callback(data);
		});
	});
};

exports.commentUser = function(generatedState, parent_id, text, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/comment').post({
			parent: parent_id,
			text: text
		}).then(function(data) {
			callback(data);
		});
	});
};


/*
	UnAuthenticated Api Calls.
 */

exports.subreddits = function (callback) {
	redditServer.getRedditServer().then(function(reddit) {
		reddit('/subreddits/popular').listing({
			limit: 50
		}).then(function(data) {
			callback(data);
		});
	});
};

exports.subreddit = function(sub, sort, limit, after, t, callback) {
	redditServer.getRedditServer().then(
		function(reddit) {
			reddit('r/$subreddit/$sort').listing({
			$subreddit: sub,
			t: t,
			limit: limit,
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

exports.user = function(username, where, sort, limit, after, t, callback) {
	redditServer.getRedditServer().then(
		function(reddit) {
			reddit('/user/$username/$where').listing({
				$username: username,
				$where: where,
				sort: sort,
				limit: limit,
				after: after,
				t: t
			}).then(
				function(data) {
					callback(data)
				}
			);
		}
	);
}


exports.comments = function(subreddit, article, sort, comment, context, callback) {
	redditServer.getRedditServer().then(function(reddit) {
		reddit('r/$subreddit/comments/$article').get({
			$subreddit: subreddit,
			$article: article,
			comment: comment,
			context: context,
			// depth: 5,
			showedits: false,
			showmore: true,
			sort: sort
		}).then(function(data) {
			callback(data);
		});
	});
};

exports.moreChildren = function(link_id, children, sort, callback) {
	redditServer.getRedditServer().then(function(reddit) {
		reddit('/api/morechildren').get({
			link_id: link_id,
			children: children,
			sort: sort
		}).then(function(data) {
			callback(data);
		});
	});
};