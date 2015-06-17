var express = require('express');
var router = express.Router();
var redditAuth = require('./reddit/redditAuth');
var RedditUser = require('./models/redditUser.js');

router.get('/', function(req, res, next) {
	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {

		if (authenticated) {
			console.log('[get/settings] authenticated, finding user to retrieve settings from....');
			RedditUser.findOne({generatedState: req.session.generatedState}, function(err, returnedUser) {
				if (err) throw new error(err);
				if (returnedUser) {
					console.log('[get/settings] user found, returning user settings.');
					res.json(returnedUser.settings);
				}
			});

		} else {
			console.log('[get/settings] not authenticated, retrieving from session object....');
			
			if (req.session.settings) {
				console.log('[get/settings] settings session object found, returning session settings.')
				res.json(req.session.settings);
			}
		}

		console.log('[get/settings] no settings found, returning empty object.');
		res.json({})
	});
});

router.post('/', function(req, res, next) {
	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {

		if (authenticated) {
			console.log('[post/settings] authenticated, finding user....')
			RedditUser.findOne({generatedState: req.session.generatedState}, function(err, returnedUser) {
				if (err) throw new error(err);
				if (returnedUser) {
					console.log('[post/settings] user found, saving settings....');
					returnUser.settings = req.body.settings;
					returnedUser.save(function(err){
	        			if (err) throw new error(err);
	        			console.log('[post/settings] settings saved in user model.');
	        			res.json(true);
	        		});
				}
			});			
		} else {
			console.log('[post/settings] not authenticated, saving in session object....');
			req.session.settings = req.body.settings;
			req.session.save(function(err){
				if (err)
					next(err);
				console.log('[post/settings] settings saved in session object.');
				res.json(true);
			});
			
		}
	}	
});