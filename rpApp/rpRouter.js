var express = require('express');
var router = express.Router();
var redditAuth = require('../reddit/redditAuth');
var rpSettingsHandler = require('./rpSettingsHandler');

router.get('/settings', function(req, res, next) {
	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {

		if (authenticated) {
			console.log('[get/settings] authenticated, finding user to retrieve settings from....');
			
			rpSettingsHandler.getUserSettings(req.session.generatedState, function(data) {
				res.json(data);
			});

		} else {
			console.log('[get/settings] not authenticated, retrieving from session object....');
			console.log('[get/setting] req.session: ' + JSON.stringify(req.session));

			rpSettingsHandler.getSettingsSession(req.session, function(data) {
				res.json(data);
			});
		}
	});
});

router.post('/settings', function(req, res, next) {
	
	console.log('[post/settings] req.body: ' + JSON.stringify(req.body));

	redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {

		if (authenticated) {
			console.log('[post/settings] authenticated, finding user....');

			rpSettingsHandler.setSettingsUser(req.session.generatedState, req.body, function(data) {
				res.json(data);
			});

		} else {
			console.log('[post/settings] not authenticated, saving in session object....');
			
			rpSettingsHandler.setSettingsSession(req.session, req.body, function(data) {
				res.json(data);
			});

			
		}
	});
});

module.exports = router;