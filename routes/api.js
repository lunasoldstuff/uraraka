var express = require('express');
var router = express.Router();
var reddit = require('../reddit/reddit');
// var qs = require('querystring');
// var url = require('url');

/* REDDIT API */

router.get('/:sub', function(req, res, next) {
    // reddit.subreddit(req.params.sub, req.params.sort, 25, function(data){
    reddit.subreddit(req.params.sub, 'new', 25, function(data){
        res.json(data.get.data.children);
    });
});

router.get('/subreddits', function(req, res, next) {
    // reddit.subreddit(req.params.sub, req.params.sort, 25, function(data){
    reddit.subreddits(function(data){
        res.json(data);
    });
});

module.exports = router;