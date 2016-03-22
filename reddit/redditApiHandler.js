var Snoocore = require('snoocore');
var when = require('when');
var open = require('open');
var RedditApp = require('../models/redditApp.js');
var crypto = require('crypto');
var redditAuthHandler = require('./redditAuthHandler');
var redditServer = require('./redditServer');

/**
 * REDDIT API CALLS
 */


exports.generic = function(req, res, next, callback) {
	redditServer.getRedditServer(req, res, next, function(reddit) {
		reddit(req.body.uri)[req.body.method](req.body.params)
			.then(function(data) {
				callback(null, data);
			})
			.catch(function(responseError) {
				callback(responseError, null);
			});
	});
};


exports.genericUser = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit(req.body.uri)[req.body.method](req.body.params)
			.then(function(data) {
				callback(null, data);
			})
			.catch(function(responseError) {
				callback(responseError, null);
			});
	});

};

/*
	Authenticated Api Calls.
 */

exports.me = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/v1/me').get().then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.byIdUser = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/by_id/$name').get({
			$name: req.params.name
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.subscribe = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/subscribe').post({
			action: req.body.action,
			sr: req.body.sr
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.gild = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/v1/gold/gild/$fullname').post({
			$fullname: req.body.fullname
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.save = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/save').post({
			id: req.body.id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.unsave = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/unsave').post({
			id: req.body.id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.vote = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/vote').post({
			id: req.body.id,
			dir: req.body.dir
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.del = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/del').post({
			id: req.body.id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.editusertext = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/editusertext').post({
			text: req.body.text,
			thing_id: req.body.thing_id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.message = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/message/$where').listing({
			$where: req.params.where,
			after: req.query.after,
			limit: req.query.limit
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.compose = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/compose').post({
			subject: req.body.subject,
			text: req.body.text,
			to: req.body.to,
			iden: req.body.iden,
			captcha: req.body.captcha
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});

	});
};

exports.redditSubmit = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/submit').post({
			kind: req.body.kind,
			sendreplies: req.body.sendreplies,
			sr: req.body.sr,
			text: req.body.text,
			title: req.body.title,
			url: req.body.url,
			resubmit: req.body.resubmit,
			iden: req.body.iden,
			captcha: req.body.captcha
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});

	});
};

exports.needsCaptcha = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/needs_captcha').get().then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.newCaptcha = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/new_captcha').post().then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});

	});
};

exports.captcha = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {

		reddit('/captcha/$iden').get({
			$iden: req.params.iden
		}).then(function(data) {
			// console.log('captcha: ' + data);
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});

	});
};

exports.frontpageUser = function(req, res, next, callback) {
	console.log('[redditApiHandler] frontpageUser');
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/$sort').listing({
			$sort: req.params.sort,
			after: req.query.after,
			limit: req.query.limit,
			t: req.query.t
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.commentsUser = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('r/$subreddit/comments/$article').get({
			$subreddit: req.params.subreddit,
			$article: req.params.article,
			comment: req.query.comment,
			context: req.query.context,
			showedits: false,
			showmore: true,
			sort: req.query.sort
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.moreChildrenUser = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/morechildren').get({
			link_id: req.query.link_id,
			children: req.query.children,
			sort: req.query.sort
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.commentUser = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/comment').post({
			parent: req.body.parent_id,
			text: req.body.text
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.searchUser = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/r/$sub/search').get({
			$sub: req.params.sub,
			q: req.query.q,
			limit: req.query.limit,
			after: req.query.after,
			before: req.query.before,
			restrict_sr: req.query.restrict_sr,
			sort: req.query.sort,
			t: req.query.t,
			type: req.query.type,

		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.readAllMessages = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/read_all_messages').post({}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.readMessage = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/api/read_message').post({
			id: req.body.message
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.subredditsMine = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/subreddits/mine/$where').listing({
			$where: req.params.where,
			limit: req.query.limit,
			after: req.query.after
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.subreddits = function(req, res, next, callback) {
	redditServer.getRedditServer(req, res, next, function(reddit) {
		reddit('/subreddits/$where').listing({
			$where: req.params.where,
			limit: req.query.limit
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.subreddit = function(req, res, next, callback) {
	redditServer.getRedditServer(req, res, next, function(reddit) {
		reddit('r/$subreddit/$sort').listing({
			$subreddit: req.params.sub,
			$sort: req.params.sort,
			t: req.query.t,
			limit: req.query.limit,
			after: req.query.after
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};


exports.subredditUser = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('r/$subreddit/$sort').listing({
			$subreddit: req.params.sub,
			$sort: req.params.sort,
			t: req.query.t,
			limit: req.query.limit,
			after: req.query.after
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};


exports.frontpage = function(req, res, next, callback) {
	redditServer.getRedditServer(req, res, next, function(reddit) {
		reddit('/$sort').listing({
			$sort: req.params.sort,
			after: req.query.after,
			limit: req.query.limit,
			t: req.query.t
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.rules = function(req, res, next, callback) {
	redditServer.getRedditServer(req, res, next, function(reddit) {
		reddit('/r/$subreddit/about').get({
			$subreddit: req.params.sub
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.rulesUser = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/r/$subreddit/about').get({
			$subreddit: req.params.sub
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.byId = function(req, res, next, callback) {
	redditServer.getRedditServer(req, res, next, function(reddit) {
		reddit('/by_id/$name').get({
			$name: req.params.name
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.user = function(req, res, next, callback) {
	redditServer.getRedditServer(req, res, next, function(reddit) {
		reddit('/user/$username/$where').listing({
			$username: req.params.username,
			$where: req.params.where,
			sort: req.query.sort,
			limit: req.query.limit,
			after: req.query.after,
			t: req.query.t
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.userUser = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/user/$username/$where').listing({
			$username: req.params.username,
			$where: req.params.where,
			sort: req.query.sort,
			limit: req.query.limit,
			after: req.query.after,
			t: req.query.t
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};


exports.comments = function(req, res, next, callback) {
	redditServer.getRedditServer(req, res, next, function(reddit) {
		reddit('r/$subreddit/comments/$article').get({
			$subreddit: req.params.subreddit,
			$article: req.params.article,
			comment: req.query.comment,
			context: req.query.context,
			// depth: 5,
			showedits: false,
			showmore: true,
			sort: req.query.sort
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.moreChildren = function(req, res, next, callback) {
	redditServer.getRedditServer(req, res, next, function(reddit) {
		reddit('/api/morechildren').get({
			link_id: link_id,
			children: children,
			sort: sort
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.aboutSubreddit = function(req, res, next, callback) {
	redditServer.getRedditServer(req, res, next, function(reddit) {
		reddit('/r/$sub/about.json').get({
			$sub: req.params.sub
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.aboutSubredditUser = function(req, res, next, callback) {
	redditAuthHandler.getInstance(req, res, next, function(reddit) {
		reddit('/r/$sub/about.json').get({
			$sub: req.params.sub
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.searchServer = function(req, res, next, callback) {
	redditServer.getRedditServer(req, res, next, function(reddit) {
		reddit('/r/$sub/search').get({
			$sub: req.params.sub,
			q: req.query.q,
			limit: req.query.limit,
			after: req.query.after,
			before: req.query.before,
			restrict_sr: req.query.restrict_sr,
			sort: req.query.sort,
			t: req.query.t,
			type: req.query.type,
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};