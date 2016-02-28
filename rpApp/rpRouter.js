var express = require('express');
var router = express.Router();
var redditAuthHandler = require('../reddit/redditAuthHandler');
var rpSettingsHandler = require('./rpSettingsHandler');
var rpMailHandler = require('./rpMailHandler');

router.get('/partials/:name', function(req, res, next) {
	var name = req.params.name;
	res.render('partials/' + name);
});

router.post('/share', function(req, res, next) {

	rpMailHandler.share(req.body.to, req.body.text, req.body.subject, function(error) {
		if (error) next(error);
		else {
			res.sendStatus(200);
		}
	});

});

router.get('/settings', function(req, res, next) {
	if (req.session.userId) {

		console.log('[get/settings] authenticated, finding user to retrieve settings from....');

		try {
			rpSettingsHandler.getUserSettings(req.session, function(data) {
				res.json(data);
			});

		} catch (err) {
			next(err);
		}


	} else {

		console.log('[get/settings] not authenticated, retrieving from session object....');
		console.log('[get/setting] req.session: ' + JSON.stringify(req.session));

		rpSettingsHandler.getSettingsSession(req.session, function(data) {
			res.json(data);
		});

	}

});

router.post('/settings', function(req, res, next) {

	console.log('[post/settings] req.body: ' + JSON.stringify(req.body));

	if (req.session.userId) {
		console.log('[post/settings] authenticated, finding user....');

		try {
			rpSettingsHandler.setSettingsUser(req.session, req.body, function(data) {
				res.json(data);
			});

		} catch (err) {
			next(err);
		}


	} else {
		console.log('[post/settings] not authenticated, saving in session object....');

		try {
			rpSettingsHandler.setSettingsSession(req.session, req.body, function(data) {
				res.json(data);
			});

		} catch (err) {
			next(err);
		}


	}

});

router.get('/throwError', function(req, res, next) {

	next(new Error("test error"));
});

router.get('*', function(req, res, next) {

	console.log('[index.js *] typeof req.session.userid === \'undefined\': ' + typeof req.session.userId === 'undefined');


	/*
		Check for broken sessions.
		The user's browser has a session id and generatedState, but they are not found in our database.
		redirect the user to logout to destroy the session.
	 */
	if (req.session.generatedState && req.session.userId) {
		redditAuthHandler.getInstance(req, res, next, function(reddit) {
			if (!reddit) {
				res.redirect('/auth/reddit/logout');
			}
		});
	}

	res.render('index', {
		title: 'reddit Plus: Material Design reddit',
		authenticated: (typeof req.session.userId !== 'undefined')
	});


});

module.exports = router;