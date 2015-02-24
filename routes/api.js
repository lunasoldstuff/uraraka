var express = require('express');
var router = express.Router();
var redditApi = require('../reddit/redditApi');
// var qs = require('querystring');
// var url = require('url');

/* REDDIT API */

router.get('/subreddit/:sub', function(req, res, next) {
    // reddit.subreddit(req.params.sub, req.params.sort, 25, function(data){
    redditApi.subreddit(req.params.sub, 'hot', 25, function(data){
        res.json(data.get.data.children);
    });
});

router.get('/subreddits', function(req, res, next) {
    redditApi.subreddits(function(data){
        res.json(data.data.children);
    });
});

module.exports = router;