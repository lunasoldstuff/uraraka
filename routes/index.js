var express = require('express');
var router = express.Router();

var qs = require('querystring');
var url = require('url');

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

/*
	Get homepage
 */
router.get('/', function(req, res, next) {
    res.locals.user = req.user;
    res.render('index', { title: 'reddit Plus: Material Design reddit' , authenticated: req.isAuthenticated() });
});

module.exports = router;