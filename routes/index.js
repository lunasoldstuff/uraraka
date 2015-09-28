var express = require('express');
var router = express.Router();
var redditAuthHandler = require('../reddit/redditAuthHandler');

var qs = require('querystring');
var url = require('url');


// router.all('*', function(req, res, next){
//     if (req.session.generatedState)
//         redditAuthHandler.isLoggedIn();
//     next();
// });

router.get('/partials/:name', function(req, res, next){
	var name = req.params.name;
	res.render('partials/' + name);
});

/*
	Get homepage
 */
router.get('*', function(req, res, next) {

	console.log('[index.js *] typeof req.session.userid === \'undefined\': ' + typeof req.session.userId === 'undefined');

	res.render('index',
		{
			title: 'reddit Plus: Material Design reddit',
			authenticated: (typeof req.session.userId !== 'undefined')
		}
	);
		

});

module.exports = router;