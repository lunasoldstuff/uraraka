var express = require('express');
var router = express.Router();
var reddit = require('../reddit/redditApi');
var qs = require('querystring');
var url = require('url');

router.get('/partials/:name', function(req, res, next){
    var name = req.params.name;
    res.render('partials/' + name);
});

router.get('/completeoauth', function (req, res, next) {
    var state = req.query.state;
    var code = req.query.code;
    var error = req.query.error;

    if(state && code) {
        console.log("state: " + state + ", code: " + code);
        reddit.completeAuthorization(state, code, error, function(){
            console.log("[ROUTER] completeAuth callback");
            res.redirect('/');
        });
    }
    // next(new Error 'OAuth failure Error');
});

/* GET home page. */

router.get('/r/:subreddit', function(req, res, next){
    //do something here if you wish.
    res.render('index', { title: 'reddit Plus: r/' + req.params.subreddit }); 
});

router.get('/', function(req, res, next) {
   res.render('index', { title: 'reddit Plus: Material Design reddit' }); 
});

module.exports = router;