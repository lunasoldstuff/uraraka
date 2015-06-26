var express = require('express');
var router = express.Router();
var redditAuth = require('./reddit/redditAuth');
var RedditUser = require('./models/redditUser.js');

router.get('/settings', function(req, res, next) {
	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {

		if (authenticated) {
			// console.log('[get/settings] authenticated, finding user to retrieve settings from....');
			RedditUser.findOne({generatedState: req.session.generatedState}, function(err, returnedUser) {
				if (err) throw new error(err);
				if (returnedUser) {
					// console.log('[get/settings] user found, returning user settings, returnedUser.settings: ' 
						// + JSON.stringify(returnedUser.settings));
					if(returnedUser.settings)
						res.json(returnedUser.settings);
					else
						res.json(null);
				} else {
					// console.log('[get/settings] no settings found, returning empty object.');
					res.json(null);
				}	
			});

		} else {
			// console.log('[get/settings] not authenticated, retrieving from session object....');
			
			// console.log('[get/setting] req.session: ' + JSON.stringify(req.session));

			if (req.session.settings) {
				// console.log('[get/settings] settings session object found, returning session settings.')
				res.json(req.session.settings);
			} else {
				// console.log('[get/settings] no settings found, returning empty object.');
				res.json(null);
			}
		}

	});
});

router.post('/settings', function(req, res, next) {
	
	console.log('[post/settings] req.body: ' + JSON.stringify(req.body));

	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {

		if (authenticated) {
			console.log('[post/settings] authenticated, finding user....');
			RedditUser.findOne({generatedState: req.session.generatedState}, function(err, returnedUser) {
				if (err) throw new error(err);
				if (returnedUser) {
					// console.log('[post/settings] user found, saving settings....');
					returnedUser.settings = req.body;
					returnedUser.save(function(err){
	        			if (err) throw new error(err);
	        			// console.log('[post/settings] settings saved in user model.');
	        			res.json(returnedUser.settings);
	        		});
				}
			});			
		} else {
			console.log('[post/settings] not authenticated, saving in session object....');
			
			req.session.settings = req.body;
			console.log('[post/settings] req.session.settings: ' + req.session.settings);
			req.session.save(function(err){
				if (err) {
					next(err);
					// console.log('[post/settings] error saving session');
				}

				// console.log('[post/settings] settings saved in session object.');
				// console.log('[post/settings] req.session: ' + JSON.stringify(req.session));
				res.json(req.session.settings);
			});
		}
	});
});

module.exports = router;