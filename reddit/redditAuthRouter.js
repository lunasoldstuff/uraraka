var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var redditAuthHandler = require('./redditAuthHandler');
var redditServer = require('./redditServer');

router.get('/servertoken', function(req, res, next) {
	redditServer.getRefreshToken(function(data) {
		res.json(data);
	})
});

router.get('/usertoken', function(req, res, next) {
	redditAuthHandler.getRefreshToken(req.session.generatedState, req.session.userId, function(data) {
		res.json(data);
	});
});

router.get('/reddit/login/:url', function(req, res, next) {
	console.log('[/auth/reddit/:url] url: ' + req.params.url);

	req.session.generatedState = crypto.randomBytes(32).toString('hex');
	req.session.url = req.params.url;

	req.session.save(function(err) {
		if (err)
			next(err);
		console.log('/reddit generatedState saved in session cookie');
	});

	res.redirect(redditAuthHandler.newInstance(req.session.generatedState));
});

router.get('/reddit/callback', function(req, res, next) {
	console.log('/reddit/callback: req.session.generatedState: ' + req.session.generatedState);

	if (req.query.error) {
		next(new Error(error));
	}

	if (req.query.state && req.query.code) {
		redditAuthHandler.completeAuth(req.session, req.query.state, req.query.code, req.query.error,
			function() {
				if (req.session.url)
					res.redirect(decodeURIComponent(req.session.url));
				else
					res.redirect('/');
			}
		);
	}
});

router.get('/reddit/appcallback', function(req, res, next) {
	var returnedState = req.query.state;
	var code = req.query.code;
	var error = req.query.error;
	if (error) {
		next(new Error(error));
	}
	if (returnedState && code) {
		redditServer.completeServerAuth(returnedState, code, error,
			function() {
				res.redirect('/');
			}
		);
	}
});

router.get('/reddit/logout', function(req, res, next) {

	redditAuthHandler.logOut(req.session.generatedState, req.session.userId, function(err, data) {
		req.session.destroy();
		res.redirect('/');
	});

});

router.get('/testMongo/', function(req, res, next) {

	console.log('redditAuthHandler test mongo');

	redditAuthHandler.testMongo(req, function() {
		res.sendStatus(200);
	});

});

module.exports = router;