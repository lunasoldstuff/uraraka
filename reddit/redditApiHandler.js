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

exports.subscribe = function(generatedState, action, sr, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/subscribe').post({
			action: action,
			sr: sr
		}).then(function(data) {
			callback(data);
		});
	});
};

exports.aboutSubredditUser = function(generatedState, sub, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {

		reddit('/r/$sub/about.json').get({
			$sub: sub
		}).then(function(data) {
			callback(data);
		});


	});
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

exports.del = function(generatedState, id, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/del').post({
			id: id
		}).then(function(data) {
			console.log('[del] data: ' + data);

			callback(data);
		});
	});
};

exports.editusertext = function(generatedState, text, thing_id, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/editusertext').post({
			text: text,
			thing_id: thing_id
		}).then(function(data) {
			callback(data);
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
			callback(null, data);
		}).catch(function(responseError) {
			console.log('[redditApiHandler] redditSubmit catch error.');
			callback(responseError, null);
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
			limit: 100,
		}).then(function(data){
			callback(data);
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
			callback(data);
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
			callback(data);
		});


	});

};

exports.readAllMessages = function(generatedState, callback) {
	redditAuth.getInstance(generatedState).then(function(reddit) {
		reddit('/api/read_all_messages').post({}).then(function(data) {
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

exports.aboutSubreddit = function(sub, callback) {
	redditServer.getRedditServer().then(function(reddit) {

		reddit('/r/$sub/about.json').get({
			$sub: sub
		}).then(function(data) {
			callback(data);
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
			callback(data);
		});


	});

};