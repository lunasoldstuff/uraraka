var express = require('express');
var router = express.Router();
var redditApiHandler = require('./redditApiHandler');
var redditAuth = require('./redditAuth');


/* REDDIT ROUTER */

/*
	User restricted Reddit Api paths
 */

router.all('*', function(req, res, next) {

	console.log('[API REQ.PATH] ' + req.path);
	next();

});

router.all('/uauth/*', function(req, res, next) {
  redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {
	  if (authenticated) {
		  next();
	  } else {
		  var error = new Error("Not authorized to view this resource");
		  error.status = 401;
		  next(error);
	  }
  });
});

router.get('/uauth/me', function(req, res, next) {
	redditApiHandler.me(req.session.generatedState, function(data){
		res.json(data);
	});
});

router.post('/uauth/vote', function(req, res, next) {
	// console.log('vote: ' + req.body.id + req.body.dir);
	redditApiHandler.vote(req.session.generatedState, req.body.id, req.body.dir, function(data) {
		// if(data) console.log('data ' + JSON.stringify(data));
		res.sendStatus(200);
	});
});

router.post('/uauth/subscribe', function(req, res, next) {
	redditApiHandler.subscribe(req.session.generatedState, req.body.action, req.body.sr, function(data) {
		res.sendStatus(200);
	});
});

router.post('/uauth/save', function(req, res, next) {
	redditApiHandler.save(req.session.generatedState, req.body.id, function(data) {
		res.sendStatus(200);
	});
});

router.post('/uauth/unsave', function(req, res, next) {
	redditApiHandler.unsave(req.session.generatedState, req.body.id, function(data) {
		res.sendStatus(200);
	});
});

router.post('/uauth/comment', function(req, res, next) {
	redditApiHandler.commentUser(req.session.generatedState, req.body.parent_id, req.body.text, function(data) {
		res.json(data);
	});
});

router.get('/uauth/message/:where', function(req, res, next) {
	redditApiHandler.message(req.session.generatedState, req.params.where, req.query.after, function(data) {
		res.json(data.get.data.children);
	});
});

router.post('/uauth/compose', function(req, res, next) {
	redditApiHandler.compose(req.session.generatedState, req.body.subject, req.body.text, req.body.to, req.body.iden, req.body.captcha, function(data) {
		res.json(data);
	});
});

router.post('/uauth/submit', function(req, res, next) {
	redditApiHandler.redditSubmit(req.session.generatedState, req.body.kind, req.body.resubmit, req.body.sendreplies, 
		req.body.sr, req.body.text, req.body.title, req.body.url, req.body.iden, req.body.captcha, function(data) {
			res.json(data);
		}
	);
});

router.get('/uauth/needs_captcha', function(req, res, next) {
	redditApiHandler.needsCaptcha(req.session.generatedState, function(data) {
		console.log('/uauth/needs_captcha data: ' + data);
		res.json({needsCaptcha: data});
	});
});

router.get('/uauth/new_captcha', function(req, res, nect) {
	redditApiHandler.newCaptcha(req.session.generatedState, function(data) {
		console.log('/uauth/new_captcha data: ' + data);
		res.json(data);
	});
});

router.get('/uauth/captcha/:iden', function(req, res, next) {
	redditApiHandler.captcha(req.session.generatedState, req.params.iden, function(data) {
		console.log('/uath/captha/:iden, data: ' + data);
		// res.type('png');
		// res.send(data);
		res.json({imageString: data});
	});
});




/*
	Reddit Api Paths
 */
router.get('/subreddit/:sub/:sort', function(req, res, next) {

	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {
		if (authenticated) {
			redditApiHandler.subredditUser(req.session.generatedState, req.params.sub, req.params.sort, 24, req.query.after, req.query.t, function(data) {
				res.json(data.get.data.children);
			});
				
		} else {           
			redditApiHandler.subreddit(req.params.sub, req.params.sort, 24, req.query.after, req.query.t, function(data) {
				res.json(data.get.data.children);
			});
				
		}
	});
});

router.get('/search/:sub', function(req, res, next) {

	console.log('[/search/sub]');

	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {
		if (authenticated) {
			redditApiHandler.searchUser(req.session.generatedState, req.params.sub, req.query.q, req.query.limit, req.query.after, req.query.before, 
				req.query.restrict_sr, req.query.sort, req.query.t, req.query.type, function(data) {
		
					res.json(data);
			});

		} else {
			redditApiHandler.searchServer(req.params.sub, req.query.q, req.query.limit, req.query.after, req.query.before, req.query.restrict_sr, 
				req.query.sort, req.query.t, req.query.type, function(data) {
					
					res.json(data);
			});
		}
	});

});

router.get('/subreddits', function(req, res, next) {
	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {

		if (authenticated) {
			redditApiHandler.subredditsUser(req.session.generatedState, function(data) {
				res.json(data.get.data.children);
			});
		} else {
			redditApiHandler.subreddits(function(data) {
				res.json(data.get.data.children);
			});
		}
	});

});

router.get('/comments/:subreddit/:article', function(req, res, next) {
	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {
		if (authenticated) {
			redditApiHandler.commentsUser(req.session.generatedState, req.params.subreddit, req.params.article, req.query.sort, req.query.comment, req.query.context, function(data) {
				res.json(data);
			});
		} else {
			redditApiHandler.comments(req.params.subreddit, req.params.article, req.query.sort, req.query.comment, req.query.context, function(data) {
				res.json(data);
			});
		}
	});
});

router.get('/morechildren', function(req, res, next) {
	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {
		if (authenticated) {
			redditApiHandler.moreChildrenUser(req.session.generatedState, req.query.link_id, req.query.children, req.query.sort, function(data) {
				res.json(data);
			});
		} else {
			redditApiHandler.moreChildren(req.query.link_id, req.query.children, req.query.sort, function(data) {
				res.json(data);
			});
		}
	});
});

router.get('/user/:username/:where', function(req, res, next) {
	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {
		if (authenticated) {
			redditApiHandler.userUser(req.session.generatedState, req.params.username, req.params.where, req.query.sort, 24, req.query.after, req.query.t, function(data) {
				res.json(data.get.data.children);
			});
		} else {
			redditApiHandler.user(req.params.username, req.params.where, req.query.sort, 24, req.query.after, req.query.t, function(data) {
				res.json(data.get.data.children);
			});
		}
	});
});

router.get('/by_id/:name', function(req, res, next) {
	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {
		if (authenticated) {
			redditApiHandler.byIdUser(req.session.generatedState, req.params.name, function(data) {
				res.json(data.data.children[0]);
			});
		} else {
			redditApiHandler.byId(req.params.name, function(data) {
				res.json(data.data.children[0]);
			});
		}
	});
});

/*
	Keep this at the bottom becasue it will match any url /api/[anything]
 */

router.get('/:sort', function(req, res, next) {

	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {

		if (authenticated) {
			redditApiHandler.frontpageUser(req.session.generatedState, req.params.sort, 24, req.query.after, req.query.t, function(data) {
				res.json(data.get.data.children);
			});
		} else {
			redditApiHandler.frontpage(req.params.sort, 24, req.query.after, req.query.t, function(data) {
				res.json(data.get.data.children);
			});
		}
	});
});

router.get('/about/:sub', function(req, res, next) {

	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {

		if (authenticated) {
			redditApiHandler.aboutSubredditUser(req.session.generatedState, req.params.sub, function(data) {
			
				res.json(data);
			
			});
		} else {
			redditApiHandler.aboutSubreddit(req.params.sub, function(data) {
				
				res.json(data);
			
			});
		}
	});
});

module.exports = router;