var express = require('express');
var router = express.Router();
var redditApiHandler = require('./redditApiHandler');
var redditAuth = require('./redditAuth');


/* REDDIT ROUTER */

/*
    Authenticated Reddit Api paths
 */

router.all('/user/*', function(req, res, next) {
  redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {
      console.log("[REDDIT API ROUTER /user/*] authenticated: " + authenticated);
      if (authenticated) {
          next();
      } else {
          var error = new Error("Not authorized to view this resource");
          error.status = 401;
          next(error);
      }
  });
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

router.post('/user/vote', function(req, res, next){
    // console.log('vote: ' + req.body.id + req.body.dir);
    redditApiHandler.vote(req.session.generatedState, req.body.id, req.body.dir, function(data){
        // if(data) console.log('data ' + JSON.stringify(data));
        res.sendStatus(200);
    });
});

/*
    Unauthenticated Reddit Api Paths
 */

router.get('/subreddit/:sub', function(req, res, next) {

    redditAuth.isLoggedIn(req.session.geenratedState, function(authenticated) {
        if (authenticated) {
            redditApiHandler.subredditUser(req.session.generatedState, req.params.sub, 'hot', 25, "", "", function(data) {
                res.json(data.get.data.children);
            });
        } else {
            redditApiHandler.subreddit(req.params.sub, 'hot', 25, "", "", function(data) {
                res.json(data.get.data.children);
            });
        }
    })
});

router.get('/subreddit/:sub/:sort', function(req, res, next) {
    redditAuth.isLoggedIn(req.session.generatedState, function(authenticated) {
        if (authenticated) {
            redditApiHandler.subredditUser(req.session.generatedState, req.params.sub, req.params.sort, 25, req.query.after, req.query.t, function(data) {
                res.json(data.get.data.children);
            });
        } else {
            redditApiHandler.subreddit(req.params.sub, req.params.sort, 25, req.query.after, req.query.t, function(data) {
                res.json(data.get.data.children);
            });
        }
    });
});

router.get('/subreddits', function(req, res, next) {
    redditApiHandler.subreddits(function(data) {
        res.json(data.data.children);
    });
});

module.exports = router;
