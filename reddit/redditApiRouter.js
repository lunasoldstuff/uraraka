var express = require('express');
var router = express.Router();
var redditApiHandler = require('./redditApiHandler');
var redditAuthHandler = require('./redditAuthHandler');

/* REDDIT ROUTER 

	- Authenticated routes.
	- Unauthenticated routes.
	- Error handler.

*/

/*
	User restricted Reddit Api paths
 */

router.all('*', function(req, res, next) {
	console.log('[API REQ.PATH] ' + req.path);
	next();
});

router.all('/uauth/*', function(req, res, next) {
	if (req.session.userId) {
		next();
	} else {
		var error = new Error("Not authorized to view this resource");
		error.status = 401;
		next(error);
  	}
});

router.get('/uauth/me', function(req, res, next) {
	redditApiHandler.me(req.session.generatedState, req.session.userId, function(err, data){
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.post('/uauth/vote', function(req, res, next) {
	redditApiHandler.vote(req.session.generatedState, req.session.userId, req.body.id, req.body.dir, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.post('/uauth/del', function(req, res, next) {
	redditApiHandler.del(req.session.generatedState, req.session.userId, req.body.id, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.post('/uauth/editusertext', function(req, res, next) {
	redditApiHandler.editusertext(req.session.generatedState, req.session.userId, req.body.text, req.body.thing_id, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.post('/uauth/subscribe', function(req, res, next) {
	redditApiHandler.subscribe(req.session.generatedState, req.session.userId, req.body.action, req.body.sr, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.post('/uauth/save', function(req, res, next) {
	redditApiHandler.save(req.session.generatedState, req.session.userId, req.body.id, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.post('/uauth/unsave', function(req, res, next) {
	redditApiHandler.unsave(req.session.generatedState, req.session.userId, req.body.id, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.post('/uauth/comment', function(req, res, next) {
	redditApiHandler.commentUser(req.session.generatedState, req.session.userId, req.body.parent_id, req.body.text, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.get('/uauth/message/:where', function(req, res, next) {
	redditApiHandler.message(req.session.generatedState, req.session.userId, req.params.where, req.query.after, req.query.limit, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.post('/uauth/compose', function(req, res, next) {
	redditApiHandler.compose(req.session.generatedState, req.session.userId, req.body.subject, req.body.text, req.body.to, req.body.iden, req.body.captcha, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.post('/uauth/submit', function(req, res, next) {
	redditApiHandler.redditSubmit(req.session.generatedState, req.session.userId, req.body.kind, req.body.resubmit, req.body.sendreplies, 
		req.body.sr, req.body.text, req.body.title, req.body.url, req.body.iden, req.body.captcha, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		}
	);
});

router.get('/uauth/needs_captcha', function(req, res, next) {
	redditApiHandler.needsCaptcha(req.session.generatedState, req.session.userId, function(err, data) {
		console.log('/uauth/needs_captcha data: ' + data);
		console.log('/uauth/needs_captcha typeof data: ' + typeof data);

		if (err) {
			next(err);
		} else {
			res.json({needsCaptcha: data});
		}		
		
	});
});

router.get('/uauth/new_captcha', function(req, res, nect) {
	redditApiHandler.newCaptcha(req.session.generatedState, req.session.userId, function(err, data) {
		console.log('/uauth/new_captcha data: ' + data);
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.get('/uauth/captcha/:iden', function(req, res, next) {
	redditApiHandler.captcha(req.session.generatedState, req.session.userId, req.params.iden, function(err, data) {
		// console.log('/uath/captha/:iden, data: ' + data);

		// res.json({imageString: data});

		if (err) {
			next(err);
		} else {
			res.json(data);
		}

	});
});

router.post('/uauth/read_all_messages', function(req, res, next) {
	redditApiHandler.readAllMessages(req.session.generatedState, req.session.userId, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});



/*
	Reddit Api Paths
 */
router.get('/subreddit/:sub/:sort', function(req, res, next) {
	
	if (req.session.userId) {
		redditApiHandler.subredditUser(req.session.generatedState, req.session.userId, req.params.sub, req.params.sort, req.query.limit, req.query.after, req.query.t, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
			
	} else {           
		redditApiHandler.subreddit(req.params.sub, req.params.sort, req.query.limit, req.query.after, req.query.t, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
			
	}
	
});

router.get('/search/:sub', function(req, res, next) {

	console.log('[/search/sub]');

	if (req.session.userId) {
		redditApiHandler.searchUser(req.session.generatedState, req.session.userId, req.params.sub, req.query.q, req.query.limit, req.query.after, req.query.before, 
			req.query.restrict_sr, req.query.sort, req.query.t, req.query.type, function(err, data) {
				if (err) {
					next(err);
				} else {
					res.json(data);
				}
		});
	} else {
		redditApiHandler.searchServer(req.params.sub, req.query.q, req.query.limit, req.query.after, req.query.before, req.query.restrict_sr, 
			req.query.sort, req.query.t, req.query.type, function(err, data) {		
				if (err) {
					next(err);
				} else {
					res.json(data);
				}
			}
		);
	}

});

router.get('/subreddits', function(req, res, next) {
	
	if (req.session.userId) {
		redditApiHandler.subredditsUser(req.session.generatedState, req.session.userId, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	} else {
		redditApiHandler.subreddits(function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	}

});

router.get('/comments/:subreddit/:article', function(req, res, next) {

	if (req.session.userId) {
		redditApiHandler.commentsUser(req.session.generatedState, req.session.userId, req.params.subreddit, req.params.article, req.query.sort, req.query.comment, req.query.context, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	} else {
		redditApiHandler.comments(req.params.subreddit, req.params.article, req.query.sort, req.query.comment, req.query.context, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	}

});

router.get('/morechildren', function(req, res, next) {
	if (req.session.userId) {
		redditApiHandler.moreChildrenUser(req.session.generatedState, req.session.userId, req.query.link_id, req.query.children, req.query.sort, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	} else {
		redditApiHandler.moreChildren(req.query.link_id, req.query.children, req.query.sort, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	}
});

router.get('/user/:username/:where', function(req, res, next) {
	console.log('[/user/' + req.params.username + '] authenticated: ' + authenticated);
	if (req.session.userId) {
		redditApiHandler.userUser(req.session.generatedState, req.session.userId, req.params.username, req.params.where, req.query.sort, req.query.limit, req.query.after, req.query.t, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	} else {
		redditApiHandler.user(req.params.username, req.params.where, req.query.sort, req.query.limit, req.query.after, req.query.t, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	}
});

router.get('/by_id/:name', function(req, res, next) {
	if (req.session.userId) {
		redditApiHandler.byIdUser(req.session.generatedState, req.session.userId, req.params.name, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	} else {
		redditApiHandler.byId(req.params.name, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	}
});

/*
	Keep this at the bottom becasue it will match any url /api/[anything]
 */

router.get('/:sort', function(req, res, next) {
	if (req.session.userId) {
		redditApiHandler.frontpageUser(req.session.generatedState, req.session.userId, req.params.sort, 24, req.query.after, req.query.t, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	} else {
		redditApiHandler.frontpage(req.params.sort, 24, req.query.after, req.query.t, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	}
});

router.get('/about/:sub', function(req, res, next) {
	if (req.session.userId) {
		redditApiHandler.aboutSubredditUser(req.session.generatedState, req.session.userId, req.params.sub, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}			
		});
	} else {
		redditApiHandler.aboutSubreddit(req.params.sub, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	}
});

/*
	Reddit ResponseError Handler.
	Log Errors to database before returning the snoocore
	Prepare and return an error object to the client application.
	
 */
router.use(function(err, req, res, next) {

	console.error('[redditApiRouter responseErrorHandler] typeof err: ' + typeof err);
	console.error('[redditApiRouter responseErrorHandler] err.constructor.name: ' + err.constructor.name);
	
	if (err.constructor.name === 'ResponseError') {
		err.responseError = true;
		res.json(err);
	} else {
		next(err);
	}

});

module.exports = router;