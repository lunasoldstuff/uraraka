var express = require('express');
var router = express.Router();
var redditApiHandler = require('./redditApiHandler');
var redditAuthHandler = require('./redditAuthHandler');
var colors = require('colors');

/* REDDIT ROUTER 

	- Authenticated routes.
	- Unauthenticated routes.
	- Error handler.

*/

/*
	User restricted Reddit Api paths
 */

router.all('*', function(req, res, next) {
	console.log(colors.cyan('[API REQ.PATH] ' + req.path));
	if (req.params) {
		console.log(colors.cyan('req.params: ' + JSON.stringify(req.params)));
	}
	if (req.query) {
		console.log(colors.cyan('req.query: ' + JSON.stringify(req.query)));
	}
	if (req.body) {
		console.log(colors.cyan('req.body: ' + JSON.stringify(req.body)));
	}
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
	redditApiHandler.me(req.session.generatedState, req.session.userId, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.post('/uauth/gild', function(req, res, next) {
	redditApiHandler.gild(req.session.generatedState, req.session.userId, req.body.fullname, function(err, data) {

		if (err) {
			next(err);
		} else {
			console.log(color.yellow(req.path));
			console.log(color.yellow('data: ' + JSON.stringify(data)));
			res.sendStatus(200);
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
			// console.log(colors.yellow('[REQ PATH] ' + req.path));
			// console.log(colors.yellow('data: ' + JSON.stringify(data)));
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
		req.body.sr, req.body.text, req.body.title, req.body.url, req.body.iden, req.body.captcha,
		function(err, data) {
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
			res.json({
				needsCaptcha: data
			});
		}

	});
});

router.post('/uauth/new_captcha', function(req, res, nect) {
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

router.get('/sidebar/:sub', function(req, res, next) {

	if (req.session.userId) {
		redditApiHandler.rulesUser(req.session.generatedState, req.session.userId, req.params.sub, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json({html: data});
			}
		});

	} else {
		redditApiHandler.rules(req.params.sub, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json({html: data});
			}
		});

	}	

});

router.get('/search/:sub', function(req, res, next) {

	if (req.session.userId) {
		redditApiHandler.searchUser(req.session.generatedState, req.session.userId, req.params.sub, req.query.q, req.query.limit, req.query.after, req.query.before,
			req.query.restrict_sr, req.query.sort, req.query.t, req.query.type,
			function(err, data) {
				if (err) {
					next(err);
				} else {
					res.json(data);
				}
			});
	} else {
		redditApiHandler.searchServer(req.params.sub, req.query.q, req.query.limit, req.query.after, req.query.before, req.query.restrict_sr,
			req.query.sort, req.query.t, req.query.type,
			function(err, data) {
				if (err) {
					next(err);
				} else {
					res.json(data);
				}
			}
		);
	}

});

router.get('/uauth/subreddits/mine/:where', function(req, res, next) {

	redditApiHandler.subredditsMine(req.session.generatedState, req.session.userId, req.params.where, req.query.limit, req.query.after, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});

});

router.get('/subreddits/:where', function(req, res, next) {

	redditApiHandler.subreddits(req.params.where, req.query.limit, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});

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

/*
	Reddit ResponseError Handler.
	Log Errors to database before returning the snoocore
	Prepare and return an error object to the client application.
	
 */
router.use(function(err, req, res, next) {

	console.error(colors.red('[redditApiRouter responseErrorHandler] req.path: ' + req.path));
	console.error(colors.red('[redditApiRouter responseErrorHandler] err: ' + JSON.stringify(err)));

	if (err.constructor.name === 'ResponseError') {
		err.responseError = true;
		res.json(err);
	} else {
		next(err);
	}

});

module.exports = router;
