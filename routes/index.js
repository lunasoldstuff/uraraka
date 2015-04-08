var express = require('express');
var router = express.Router();
var redditAuth = require('../reddit/redditAuth');

var qs = require('querystring');
var url = require('url');


// router.all('*', function(req, res, next){
//     if (req.session.generatedState)
//         redditAuth.isLoggedIn();
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

    console.log('[index.js router get *] req.session.generatedState: ' + req.session.generatedState);

    redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {
        res.render('index',
            {
                title: 'reddit Plus: Material Design reddit',
                authenticated: authenticated
            }
        );
    });

});

module.exports = router;