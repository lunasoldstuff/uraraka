var express = require('express');
var router = express.Router();
var redditAuth = require('../reddit/redditAuth');

var qs = require('querystring');
var url = require('url');

router.all('*', function(req, res, next){
    if (req.session.generatedState)
        redditAuth.isLoggedIn();
    next();
});

router.get('/partials/:name', function(req, res, next){
    var name = req.params.name;
    res.render('partials/' + name);
});

/*
	Get subreddit
 */
router.get('/r/:subreddit', function(req, res, next){
    //do something here if you wish.
    res.render('index', { title: 'reddit Plus: r/' + req.params.subreddit }); 
});

router.get('/r/:subreddit/:sort', function(req, res, next){
    //do something here if you wish.
    res.render('index', { title: 'reddit Plus: r/' + req.params.subreddit }); 
});

/*
	Get homepage
 */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'reddit Plus: Material Design reddit' , authenticated: redditAuth.isLoggedIn(req.session.generatedState) });
});

module.exports = router;