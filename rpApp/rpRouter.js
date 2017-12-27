var express = require('express');
var router = express.Router();
var redditAuthHandler = require('../reddit/redditAuthHandler');
var rpSettingsHandler = require('./rpSettingsHandler');
var rpMailHandler = require('./rpMailHandler');
// var rpStripeHandler = require('./rpStripeHandler');

router.get('/partials/:name', function(req, res, next) {
	var name = req.params.name;
	res.render('partials/' + name);
});

// router.get('/cancelSubscription', function(req, res, next) {
//     rpStripeHandler.cancelSubscription(req.session.userId, function(error, data) {
//         console.log('[/cancelSubscription]');
//         if (error) next(error);
//         else {
//             res.json({
//                 subscription: data
//             });
//         }
//     });
// });
//
// router.get('/subscribe/', function(req, res, next) {
//     rpStripeHandler.getSubscription(req.session.userId, function(error, data) {
//         if (error) next(error);
//         else {
//             res.json({
//                 subscription: data
//             });
//         }
//     });
// });
//
// router.post('/subscribe', function(req, res, next) {
//     rpStripeHandler.subscribe(req.session.userId, req.body.token, req.body.email, function(error, data) {
//         if (error) next(error);
//         else {
//             res.json({
//                 subscription: data
//             });
//         }
//     });
// });

router.post('/feedback', function(req, res, next) {
	rpMailHandler.feedback(req.body.to, req.body.title, req.body.text, req.body.name,
		function(error) {
			if (error) next(error);
			else {
				res.sendStatus(200);
			}
		});

});

router.post('/share', function(req, res, next) {
	rpMailHandler.share(req.body.to, req.body.shareTitle, req.body.shareLink, req.body.name, req.body.optionalMessage,
		function(error) {
			if (error) next(error);
			else {
				res.sendStatus(200);
			}
		});
});

router.get('/settingsapi', function(req, res, next) {
	if (req.session.userId) {

		//console.log('[get/settings] authenticated, finding user to retrieve settings from....');

		try {
			rpSettingsHandler.getUserSettings(req.session, function(data) {
				res.json(data);
			});

		} catch (err) {
			next(err);
		}


	} else {

		//console.log('[get/settings] not authenticated, retrieving from session object....');
		//console.log('[get/setting] req.session: ' + JSON.stringify(req.session));

		rpSettingsHandler.getSettingsSession(req.session, function(data) {
			res.json(data);
		});

	}

});

router.post('/settingsapi', function(req, res, next) {

	//console.log('[post/settings] req.body: ' + JSON.stringify(req.body));

	if (req.session.userId) {
		//console.log('[post/settings] authenticated, finding user....');

		try {
			rpSettingsHandler.setSettingsUser(req.session, req.body, function(data) {
				res.json(data);
			});

		} catch (err) {
			next(err);
		}


	} else {
		//console.log('[post/settings] not authenticated, saving in session object....');

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