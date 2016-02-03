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

/*
	Authenticated Api Calls.
 */

exports.me = function(generatedState, userId, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/api/v1/me').get().then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.byIdUser = function(generatedState, userId, name, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/by_id/$name').get({
			$name: name
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.subscribe = function(generatedState, userId, action, sr, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/api/subscribe').post({
			action: action,
			sr: sr
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.gild = function(generatedState, userId, fullname, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/api/v1/gold/gild/$fullname').post({
			$fullname: fullname
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.save = function(generatedState, userId, id, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/api/save').post({
			id: id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.unsave = function(generatedState, userId, id, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/api/unsave').post({
			id: id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.vote = function(generatedState, userId, id, dir, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/api/vote').post({
			id: id,
			dir: dir
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.del = function(generatedState, userId, id, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/api/del').post({
			id: id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.editusertext = function(generatedState, userId, text, thing_id, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/api/editusertext').post({
			text: text,
			thing_id: thing_id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.message = function(generatedState, userId, where, after, limit, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {

		reddit('/message/$where').listing({
			$where: where,
			after: after,
			limit: limit

		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});

	});
};

exports.compose = function(generatedState, userId, subject, text, to, iden, captcha, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {

		reddit('/api/compose').post({
			subject: subject,
			text: text,
			to: to,
			iden: iden,
			captcha: captcha
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});

	});
};

exports.redditSubmit = function(generatedState, userId, kind, resubmit, sendreplies, sr, text, title, url, iden, captcha, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {

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
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});

	});
};

exports.needsCaptcha = function(generatedState, userId, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {

		reddit('/api/needs_captcha').get().then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});

	});
};

exports.newCaptcha = function(generatedState, userId, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {

		reddit('/api/new_captcha').post().then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});

	});
};

exports.captcha = function(generatedState, userId, iden, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {

		reddit('/captcha/$iden').get({
			$iden: iden
		}).then(function(data) {
			// console.log('captcha: ' + data);
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});

	});
};

exports.frontpageUser = function(generatedState, userId, sort, limit, after, t, callback) {
	// console.log('[fontpageUser] sort: ' + sort + ', limit: ' + limit + ', after' + after + ', t: ' + t);
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/$sort').listing({
			$sort: sort,
			after: after,
			limit: limit,
			t: t
		}).then(function(data) {
			// if (data.get.data.children.length > 0) {
			// 	console.log('[frontpageUser] data.get.data.children.length: ' + data.get.data.children.length);
			// } else {
			// 	console.log('[frontpageUser] data: ' + JSON.stringify(data));
			// }
			callback(null, data);
		}).catch(function(responseError) {
			// console.log('[frontpageUser] responseError: ' + JSON.stringify(responseError));
			callback(responseError, null);
		});
	});
};

exports.commentsUser = function(generatedState, userId, subreddit, article, sort, comment, context, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('r/$subreddit/comments/$article').get({
			$subreddit: subreddit,
			$article: article,
			comment: comment,
			context: context,
			showedits: false,
			showmore: true,
			sort: sort
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.moreChildrenUser = function(generatedState, userId, link_id, children, sort, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
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

exports.commentUser = function(generatedState, userId, parent_id, text, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/api/comment').post({
			parent: parent_id,
			text: text
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.searchUser = function(generatedState, userId, sub, q, limit, after, before, restrict_sr, sort, t, type, callback) {

	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/r/$sub/search').get({
			$sub: sub,
			q: q,
			limit: limit,
			after: after,
			before: before,
			restrict_sr: restrict_sr,
			sort: sort,
			t: t,
			type: type,

		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.readAllMessages = function(generatedState, userId, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/api/read_all_messages').post({}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.readMessage = function(generatedState, userId, id, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/api/read_message').post({
			id: id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.subredditsMine = function(generatedState, userId, where, limit, after, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/subreddits/mine/$where').listing({
			$where: where,
			limit: limit,
			after: after
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.subreddits = function(where, limit, callback) {
	redditServer.getRedditServer(function(reddit) {
		reddit('/subreddits/$where').listing({
			$where: where,
			limit: limit
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.subreddit = function(sub, sort, limit, after, t, callback) {
	redditServer.getRedditServer(function(reddit) {
		reddit('r/$subreddit/$sort').listing({
			$subreddit: sub,
			t: t,
			limit: limit,
			after: after,
			$sort: sort
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};


exports.subredditUser = function(generatedState, userId, sub, sort, postLimit, after, t, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('r/$subreddit/$sort').listing({
			$subreddit: sub,
			t: t,
			limit: postLimit,
			after: after,
			$sort: sort
		}).then(function(data) {
			// console.log('[subredditUser] data: ' + JSON.stringify(data));
			callback(null, data);
		}).catch(function(responseError) {
			// console.log('[redditApiHandler] subredditUser, responseError: ' + JSON.stringify(responseError));
			callback(responseError, null);
		});
	});
};


exports.frontpage = function(sort, limit, after, t, callback) {
	redditServer.getRedditServer(function(reddit) {
		reddit('/$sort').listing({
			$sort: sort,
			after: after,
			limit: limit,
			t: t
		}).then(function(data) {
			// console.log('[frontpage] data: ' + JSON.stringify(data));
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.rules = function(sub, callback) {
	redditServer.getRedditServer(function(reddit) {
		reddit('/r/$subreddit/about').get({
			$subreddit: sub
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.rulesUser = function(generatedState, userId, sub, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/r/$subreddit/about').get({
			$subreddit: sub
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.byId = function(name, callback) {
	// console.log('name: ' + name);
	redditServer.getRedditServer(function(reddit) {
		reddit('/by_id/$name').get({
			$name: name
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.user = function(username, where, sort, limit, after, t, callback) {
	redditServer.getRedditServer(function(reddit) {
		reddit('/user/$username/$where').listing({
			$username: username,
			$where: where,
			sort: sort,
			limit: limit,
			after: after,
			t: t
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.userUser = function(generatedState, userId, username, where, sort, limit, after, t, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/user/$username/$where').listing({
			$username: username,
			$where: where,
			sort: sort,
			limit: limit,
			after: after,
			t: t
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};


exports.comments = function(subreddit, article, sort, comment, context, callback) {
	redditServer.getRedditServer(function(reddit) {
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
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.moreChildren = function(link_id, children, sort, callback) {
	redditServer.getRedditServer(function(reddit) {
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

exports.aboutSubreddit = function(sub, callback) {
	redditServer.getRedditServer(function(reddit) {
		reddit('/r/$sub/about.json').get({
			$sub: sub
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.aboutSubredditUser = function(generatedState, userId, sub, callback) {
	redditAuthHandler.getInstance(generatedState, userId, function(reddit) {
		reddit('/r/$sub/about.json').get({
			$sub: sub
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};

exports.searchServer = function(sub, q, limit, after, before, restrict_sr, sort, t, type, callback) {
	redditServer.getRedditServer(function(reddit) {
		reddit('/r/$sub/search').get({
			$sub: sub,
			q: q,
			limit: limit,
			after: after,
			before: before,
			restrict_sr: restrict_sr,
			sort: sort,
			t: t,
			type: type,
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
	});
};