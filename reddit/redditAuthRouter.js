var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var redditAuth = require('./redditAuth');
var redditServer = require('./redditServer');

router.get('/reddit/login/:url', function(req, res, next) {
	console.log('[/auth/reddit/:url] url: ' + req.params.url);
	
	req.session.generatedState = crypto.randomBytes(32).toString('hex');
	req.session.url = req.params.url;
	
	req.session.save(function(err){
		if (err)
			next(err);
		console.log('/reddit generatedState saved in session cookie');
	});
	
	res.redirect(redditAuth.newInstance(req.session.generatedState));
});

router.get('/reddit/callback', function(req, res, next) {
   console.log('/reddit/callback: req.session.generatedState: ' + req.session.generatedState);

    if (req.query.error) {
    	next(new Error(error));
    }

    if (req.query.state && req.query.code) {
        redditAuth.completeAuth(req.session.generatedState, req.query.state, req.query.code, req.query.error, 
        	function() {
        		if (req.session.url)
        			res.redirect(decodeURIComponent(req.session.url));
        		else
        			res.redirect('/');
			}
		);
    }
});

router.get('/reddit/appcallback', function (req, res, next) {
   	var returnedState = req.query.state;
	var code = req.query.code;
	var error = req.query.error;
	if (error) {
		next(new Error(error));
	}
	if (returnedState && code) {
	    redditServer.completeServerAuth(returnedState, code, error, 
	    	function(){
	    		res.redirect('/');
			}
		);
	}
});

router.get('/reddit/logout', function(req, res, next) {
	redditAuth.removeInstance(req.session.generatedState);
	res.redirect('/');
	//delete the session.generated key as well..
	req.session.destroy();
});

module.exports = router;