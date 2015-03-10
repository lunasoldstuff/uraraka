var express = require('express');
var router = express.Router();
var redditApiHandler = require('./redditApiHandler');
var redditAuth = require('./redditAuth');


/* REDDIT ROUTER */

/*
    Authenticated Reddit Api paths
 */

router.get('/user/*', function(req, res, next) {
  if (redditAuth.isLoggedIn(req.session.generatedState)) { 
    return next(); 
  }
  var error = new Error("Not authorized to view this resource");
  error.http_code = 401;
  next(error);
});  

router.get('/user/subreddits', function(req, res, next) {
    redditApiHandler.subredditsUser(req.session.generatedState, function(data) {
        res.json(data.data.children);
    });        
});

router.get('/user/me', function(req, res, next) {
    redditApiHandler.me(req.session.generatedState, function(data){
        res.json(data);
    });
});


/*
    Unauthenticated Reddit Api Paths
 */

router.get('/subreddit/:sub', function(req, res, next) {
    // reddit.subreddit(req.params.sub, req.params.sort, 25, function(data){
    redditApiHandler.subreddit(req.params.sub, 'hot', 25, function(data) {
        res.json(data.get.data.children);
    });
});

router.get('/subreddit/:sub/:sort', function(req, res, next) {
    // reddit.subreddit(req.params.sub, req.params.sort, 25, function(data){
    redditApiHandler.subreddit(req.params.sub, req.params.sort, 25, req.query.after, function(data) {
        res.json(data.get.data.children);
    });
});

router.get('/subreddits', function(req, res, next) {
    redditApiHandler.subreddits(function(data) {
        res.json(data.data.children);
    });
});

module.exports = router;