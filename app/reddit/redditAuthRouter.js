var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var redditAuthHandler = require('./redditAuthHandler');
var redditServer = require('./redditServer');
var config = require('./redditConfig.js').config();

router.get('/env', function (req, res, next) {
  res.json({
    env: process.env.NODE_ENV || 'development',
    config: config
  });
});

router.get('/token', function (req, res, next) {
  // console.log('[auth /usertoken]');
  redditAuthHandler.getRefreshToken(req, res, next, function (data) {
    res.json({
      refreshToken: data,
      env: process.env.NODE_ENV || 'development',
      config: config
    });
  });
});

router.get('/reddit/login/:url', function (req, res, next) {
  // console.log('[/auth/reddit/:url] url: ' + req.params.url);

  req.session.generatedState = crypto.randomBytes(32).toString('hex');
  req.session.url = req.params.url;

  req.session.save(function (err) {
    if (err) {
      next(err);
    } else {
      // console.log('/reddit generatedState saved in session cookie');
      res.redirect(redditAuthHandler.newInstance(req.session.generatedState));
    }
  });
});

router.get('/reddit/callback', function (req, res, next) {
  // console.log('/reddit/callback: req.session.generatedState: ' + req.session.generatedState);

  if (req.query.error) {
    next(new Error(req.query.error));
  }

  if (req.query.state && req.query.code) {
    redditAuthHandler.completeAuth(
      req.session,
      req.query.state,
      req.query.code,
      req.query.error,
      function () {
        if (req.session.url) {
          res.redirect(decodeURIComponent(req.session.url));
        } else {
          res.redirect('/');
        }
      }
    );
  }
});

router.get('/reddit/logout', function (req, res, next) {
  redditAuthHandler.logOut(req, res, next, function (err, data) {
    // console.log('[redditAuthRouter /reddit/logout] logOut callback, redirect to /');
    req.session.destroy();
    res.redirect('/');
  });
});

module.exports = router;
