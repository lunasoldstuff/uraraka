var express = require('express');
var router = express.Router();
var twitterApiHandler = require('./twitterApiHandler');

router.get('/status/:id', function(req, res, next){
	twitterApiHandler.status(req.params.id, function(data){
		res.json(data);
	});
});

module.exports = router;