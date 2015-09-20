var Snoocore = require('snoocore');
var when = require('when');
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
		reddit('/api/v1/me').get().then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.byIdUser = function(generatedState, name, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/by_id/$name').get({
			$name: name
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.subscribe = function(generatedState, action, sr, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/subscribe').post({
			action: action,
			sr: sr
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.aboutSubredditUser = function(generatedState, sub, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {

		reddit('/r/$sub/about.json').get({
			$sub: sub
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});


	});
};

exports.save = function(generatedState, id, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/save').post({
			id: id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.unsave = function(generatedState, id, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/unsave').post({
			id: id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.vote = function(generatedState, id, dir, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/vote').post({
			id: id,
			dir: dir
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.del = function(generatedState, id, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/del').post({
			id: id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.editusertext = function(generatedState, text, thing_id, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/editusertext').post({
			text: text,
			thing_id: thing_id
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.message = function(generatedState, where, after, limit, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {

		reddit('/message/$where').listing({
			$where: where,
			after: after,
			limit: limit

		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
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
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
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
			callback(null, data);
		}).catch(function(responseError) {
			callback(responseError, null);
		});
		
	});
};

exports.needsCaptcha = function(generatedState, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {

		reddit('/api/needs_captcha').get().then(function(data) {
			console.log('needsCaptcha: ' + data);
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});

	});
};

exports.newCaptcha = function(generatedState, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {

		reddit('/api/new_captcha').post().then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});

	});
};

exports.captcha = function(generatedState, iden, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {

		reddit('/captcha/$iden').get({
			$iden: iden
		}).then(function(data) {
			console.log('captcha: ' + data);
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});

	});
};



exports.subredditsUser = function(generatedState, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/subreddits/mine/subscriber').listing({
			limit: 100,
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.frontpageUser = function(generatedState, sort, limit, after, t, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit){
		reddit('/$sort').listing({
			$sort: sort,
			after: after,
			limit: limit,
			t: t
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
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
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
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
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.commentUser = function(generatedState, parent_id, text, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/comment').post({
			parent: parent_id,
			text: text
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.searchUser = function(generatedState, sub, q, limit, after, before, restrict_sr, sort, t, type, callback) {

	redditAuth.getInstance(generatedState).then(function(reddit) {
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
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.readAllMessages = function(generatedState, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/read_all_messages').post({}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
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
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.subreddit = function(sub, sort, limit, after, t, callback) {
	redditServer.getRedditServer().then(function(reddit) {
		reddit('r/$subreddit/$sort').listing({
			$subreddit: sub,
			t: t,
			limit: limit,
			after: after,
			$sort: sort
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	}); 
};


exports.subredditUser = function(generatedState, sub, sort, postLimit, after, t, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('r/$subreddit/$sort').listing({
		$subreddit: sub,
		t: t,
		limit: postLimit,
		after: after,
		$sort: sort
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
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
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.byId = function(name, callback) {
	console.log('name: ' + name);
	redditServer.getRedditServer().then(function(reddit) {
		reddit('/by_id/$name').get({
			$name: name
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.user = function(username, where, sort, limit, after, t, callback) {
	redditServer.getRedditServer().then(function(reddit) {
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
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.userUser = function(generatedState, username, where, sort, limit, after, t, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
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
			callback(JSON.parse(responseError.body), null);
		});
	});
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
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
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
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.aboutSubreddit = function(sub, callback) {
	redditServer.getRedditServer().then(function(reddit) {
		reddit('/r/$sub/about.json').get({
			$sub: sub
		}).then(function(data) {
			callback(null, data);
		}).catch(function(responseError) {
			callback(JSON.parse(responseError.body), null);
		});
	});
};

exports.searchServer = function(sub, q, limit, after, before, restrict_sr, sort, t, type, callback) {
	redditServer.getRedditServer().then(function(reddit) {
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
			callback(JSON.parse(responseError.body), null);
		});
	});
};