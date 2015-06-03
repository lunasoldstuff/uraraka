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
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/v1/me').get().then(function(data){
			callback(data);
		});
	});
};

exports.byIdUser = function(generatedState, name, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
			reddit('/by_id/$name').get({
				$name: name
			}).then(
				function(data) {
					callback(data);
				}
			);
		}
	);
};

exports.save = function(generatedState, id, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/save').post({
			id: id
		}).then(function(data) {
			callback(data);
		});
	});
};

exports.unsave = function(generatedState, id, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/unsave').post({
			id: id
		}).then(function(data) {
			callback(data);
		});
	});
};

exports.vote = function(generatedState, id, dir, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/vote').post({
			id: id,
			dir: dir
		}).then(function(data){
			callback(data);
		});
	});
};

exports.message = function(generatedState, where, after, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {

		reddit('/message/$where').listing({
			$where: where,
			after: after
		}).then(function(data) {
			callback(data);
		});

	});
};

exports.compose = function(generatedState, subject, text, to, iden, captcha, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {

		reddit('/api/compose').post({
			subject: subject,
			text: text,
			to: to,
			iden: iden,
			captcha: captcha
		}).then(function(data) {
			callback(data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body));
		});

	});
};

exports.redditSubmit = function(generatedState, kind, resubmit, sendreplies, sr, text, title, url, iden, captcha, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {

		reddit('/api/submit').post({
			kind: kind,
			sendreplies: sendreplies,
			sr: sr,
			text: text,
			title: title,
			url: url,
			resubmit: resubmit,
			iden: iden, 
			captcha: captcha
		}).then(function(data) {
			callback(data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body));
		});
		
	});
};

exports.needsCaptcha = function(generatedState, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {

		reddit('/api/needs_captcha').get().then(function(data) {
			callback(data);
		});

	});
};

exports.newCaptcha = function(generatedState, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {

		reddit('/api/new_captcha').post().then(function(data) {
			callback(data);
		});

	});
};

exports.captcha = function(generatedState, iden, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {

		reddit('/captcha/$iden').get({
			$iden: iden
		}).then(function(data) {
			callback(data);
		});

	});
};



exports.subredditsUser = function(generatedState, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
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

exports.frontpageUser = function(generatedState, sort, limit, after, t, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit){
		reddit('/$sort').listing({
			$sort: sort,
			after: after,
			limit: limit,
			t: t
		}).then(function(data) {
			callback(data);
		});
	});
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
					callback(data);
				}
			);
		}
	);
};

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
					callback(false, data);
				}
			).catch(function(responseError) {
				var randomSubRe = /https:\/\/oauth\.reddit\.com\/r\/([\w]+)*/i;
				var groups = randomSubRe.exec(responseError.body);
				groups[0] = 'redirect';
				callback(true, groups);
			});
		}
	); 
};
	
exports.randomSub = function(callback) {
	redditServer.getRedditServer().then(function(reddit) {
		reddit('r/subreddit/random').get({}, function(data) {
			callback(data);
		});
	});
};

exports.frontpage = function(sort, limit, after, t, callback) {
	redditServer.getRedditServer().then(function(reddit){
		reddit('/$sort').listing({
			$sort: sort,
			after: after,
			limit: limit,
			t: t
		}).then(function(data) {
			callback(data);
		});
	});
};

exports.byId = function(name, callback) {
	console.log('name: ' + name);
	redditServer.getRedditServer().then(
		function(reddit) {
			reddit('/by_id/$name').get({
				$name: name
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
					callback(data);
				}
			);
		}
	);
};



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