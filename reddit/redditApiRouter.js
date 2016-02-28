var express = require('express');
var router = express.Router();
var redditApiHandler = require('./redditApiHandler');
var redditAuthHandler = require('./redditAuthHandler');
var colors = require('colors');
var RedditApp = require('../models/redditApp');


/* REDDIT ROUTER

	- Authenticated routes.
	- Unauthenticated routes.
	- Error handler.

*/

/*
	User restricted Reddit Api paths
 */

router.all('*', function(req, res, next) {
	console.log(colors.cyan('[redditApiRouter] req.path: ' + req.path));
	if (req.params) {
		console.log(colors.cyan('[redditApiRouter] req.params: ' + JSON.stringify(req.params)));
	}
	if (req.query) {
		console.log(colors.cyan('[redditApiRouter] req.query: ' + JSON.stringify(req.query)));
	}
	if (req.body) {
		console.log(colors.cyan('[redditApiRouter] req.body: ' + JSON.stringify(req.body)));
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
	redditApiHandler.me(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.post('/uauth/gild', function(req, res, next) {
	redditApiHandler.gild(req, res, next, function(err, data) {

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
	redditApiHandler.vote(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.post('/uauth/del', function(req, res, next) {
	redditApiHandler.del(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.post('/uauth/editusertext', function(req, res, next) {
	redditApiHandler.editusertext(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.post('/uauth/subscribe', function(req, res, next) {
	redditApiHandler.subscribe(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.post('/uauth/save', function(req, res, next) {
	redditApiHandler.save(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.post('/uauth/unsave', function(req, res, next) {
	redditApiHandler.unsave(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.post('/uauth/comment', function(req, res, next) {
	redditApiHandler.commentUser(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.get('/uauth/message/:where', function(req, res, next) {
	redditApiHandler.message(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.post('/uauth/compose', function(req, res, next) {
	redditApiHandler.compose(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.post('/uauth/submit', function(req, res, next) {
	redditApiHandler.redditSubmit(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.get('/uauth/needs_captcha', function(req, res, next) {
	redditApiHandler.needsCaptcha(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json({
				needsCaptcha: data
			});
		}

	});
});

router.post('/uauth/new_captcha', function(req, res, next) {
	redditApiHandler.newCaptcha(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.get('/uauth/captcha/:iden', function(req, res, next) {
	redditApiHandler.captcha(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}

	});
});

router.post('/uauth/read_all_messages', function(req, res, next) {
	redditApiHandler.readAllMessages(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
});

router.post('/uauth/read_message', function(req, res, next) {
	redditApiHandler.readMessage(req, res, next, function(err, data) {
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
		redditApiHandler.subredditUser(req, res, next, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});

	} else {
		redditApiHandler.subreddit(req, res, next, function(err, data) {
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
		redditApiHandler.rulesUser(req, res, next, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json({
					html: data
				});
			}
		});

	} else {
		redditApiHandler.rules(req, res, next, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json({
					html: data
				});
			}
		});

	}

});

router.get('/search/:sub', function(req, res, next) {

	if (req.session.userId) {
		redditApiHandler.searchUser(req, res, next, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	} else {
		redditApiHandler.searchServer(req, res, next, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	}

});

router.get('/uauth/subreddits/mine/:where', function(req, res, next) {

	redditApiHandler.subredditsMine(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});

});

router.get('/subreddits/:where', function(req, res, next) {

	redditApiHandler.subreddits(req, res, next, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});

});

router.get('/comments/:subreddit/:article', function(req, res, next) {

	if (req.session.userId) {
		redditApiHandler.commentsUser(req, res, next, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json({
					data: data
				});
			}
		});
	} else {
		redditApiHandler.comments(req, res, next, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json({
					data: data
				});
			}
		});
	}

});

router.get('/morechildren', function(req, res, next) {
	if (req.session.userId) {
		redditApiHandler.moreChildrenUser(req, res, next, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	} else {
		redditApiHandler.moreChildren(req, res, next, function(err, data) {
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
		redditApiHandler.userUser(req, res, next, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	} else {
		redditApiHandler.user(req, res, next, function(err, data) {
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
		redditApiHandler.byIdUser(req, res, next, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	} else {
		redditApiHandler.byId(req, res, next, function(err, data) {
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
		redditApiHandler.aboutSubredditUser(req, res, next, function(err, data) {
			if (err) {
				next(err);
			} else {
				res.json(data);
			}
		});
	} else {
		redditApiHandler.aboutSubreddit(req, res, next, function(err, data) {
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
		redditApiHandler.frontpageUser(req, res, next, function(err, data) {
			if (err) {
				console.log('[redditApiRouter /:sort] err');
				next(err);
			} else {
				res.json(data);
			}
		});
	} else {
		redditApiHandler.frontpage(req, res, next, function(err, data) {
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
	console.error(colors.red('[redditApiRouter responseErrorHandler] err.message: ' + err.message));

	if (err.constructor.name === 'ResponseError') {
		err.responseError = true;
		res.json(err);
	} else {
		next(err);
	}

});

module.exports = router;