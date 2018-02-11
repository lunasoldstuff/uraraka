var express = require('express');
var router = express.Router();
var mailHandler = require('./mailHandler');

router.post('/feedback', function(req, res, next) {
	mailHandler.feedback(req.body.to, req.body.title, req.body.text, req.body.name,
		function(error) {
			if (error) next(error);
			else {
				res.sendStatus(200);
			}
		}
	);
});

router.post('/share', function(req, res, next) {
	mailHandler.share(req.body.to, req.body.shareTitle, req.body.shareLink, req.body.name, req.body.optionalMessage,
		function(error) {
			if (error) next(error);
			else {
				res.sendStatus(200);
			}
		});
});

module.exports = router;