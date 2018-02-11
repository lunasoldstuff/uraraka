var express = require('express');
var router = express.Router();
var redditAuthHandler = require('reddit/redditAuthHandler');
var settingsHandler = require('./rpsettingsHandler');

router.get('/partials/:name', function(req, res, next) {
	var name = req.params.name;
	res.render('partials/' + name);
});

router.get('/settingsapi', function(req, res, next) {
	if (req.session.userId) {

		//console.log('[get/settings] authenticated, finding user to retrieve settings from....');

		try {
			settingsHandler.getUserSettings(req.session, function(data) {
				res.json(data);
			});

		} catch (err) {
			next(err);
		}


	} else {

		//console.log('[get/settings] not authenticated, retrieving from session object....');
		//console.log('[get/setting] req.session: ' + JSON.stringify(req.session));

		settingsHandler.getSettingsSession(req.session, function(data) {
			res.json(data);
		});

	}

});

router.post('/settingsapi', function(req, res, next) {

	//console.log('[post/settings] req.body: ' + JSON.stringify(req.body));

	if (req.session.userId) {
		//console.log('[post/settings] authenticated, finding user....');

		try {
			settingsHandler.setSettingsUser(req.session, req.body, function(data) {
				res.json(data);
			});

		} catch (err) {
			next(err);
		}


	} else {
		//console.log('[post/settings] not authenticated, saving in session object....');

		try {
			settingsHandler.setSettingsSession(req.session, req.body, function(data) {
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

	//console.log('[index.js *] typeof req.session.userid === \'undefined\': ' + typeof req.session.userId === 'undefined');


	/*
		Check for broken sessions.
		The user's browser has a session id and generatedState, but they are not found in our database.
		redirect the user to logout to destroy the session.
	 */
	if (req.session.generatedState && req.session.userId) {
		redditAuthHandler.getInstance(req, res, next, function(reddit) {
			if (!reddit) {
				res.redirect('/auth/reddit/logout');
			} else {
				res.render('index', {
					title: 'reddup',
					authenticated: true,
					userAgent: req.headers['user-agent']
				});

			}
		});
	} else {
		res.render('index', {
			title: 'reddup',
			authenticated: false,
			userAgent: req.headers['user-agent']
		});

	}

});

module.exports = router;