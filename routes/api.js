var express = require('express');
var router = express.Router();
var redditApi = require('../reddit/redditApi');
var imgurApi = require('../imgur/imgurApi');

// var qs = require('querystring');
// var url = require('url');

/* REDDIT API */

//Web App Paths
router.get('/subreddit/:sub', function(req, res, next) {
    // reddit.subreddit(req.params.sub, req.params.sort, 25, function(data){
    redditApi.subreddit(req.params.sub, 'hot', 25, function(data) {
        res.json(data.get.data.children);
    });
});

router.get('/subreddits', function(req, res, next) {
    if (req.isAuthenticated()) {
        redditApi.subredditsUser(req.user, function(data) {
            res.json(data.data.children);
        });        
    } else {
        redditApi.subreddits(function(data) {
            res.json(data.data.children);
        });
    }
});

//User specific paths
//TODO protect with isLoggedIn
router.get('/user/*', isLoggedIn);

router.get('/user/subreddits', function(req, res, next){
    redditApi.subredditsUser(req.user.reddit.refreshToken, function(data) {
        res.json(data.data.children);
    });        
});

/* IMGUR API */
router.get('/imgur/image/:id', function(req, res, next){
    imgurApi.image(req.params.id, function(data) {
        console.log(data);
        res.json(data);
    });
});

router.get('/imgur/album/:id', function(req, res, next){
    imgurApi.album(req.params.id, function(data) {
		res.json(data);
	});
});

function isLoggedIn(req, res, next) {
  console.log('[isAuthenticated]');
  if (req.isAuthenticated()) { 
    return next(); 
  }
  var error = new Error("Not authorized to view this resource");
  error.http_code = 401;
  next(error);
}   



module.exports = router;