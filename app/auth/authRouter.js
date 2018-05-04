var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var authHandler = require('./authHandler');
var config = require('./config.js')
  .config();

router.get('/reddit/login/:url', function (req, res, next) {
  req.session.generatedState = crypto.randomBytes(32)
    .toString('hex');
  req.session.url = req.params.url;

  req.session.save(function (err) {
    if (err) {
      next(err);
    } else {
      res.redirect(authHandler.newInstance(req.session.generatedState));
    }
  });
});

router.get('/reddit/callback', function (req, res, next) {
  if (req.query.error) {
    next(new Error(req.query.error));
  }

  if (req.query.state && req.query.code) {
    authHandler.completeAuth(
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
  authHandler.logOut(req, res, next, function (err, data) {
    req.session.destroy();
    res.redirect('/');
  });
});

module.exports = router;
