/**
  Only here for legacy reddit app purposes
  Once the app has been updated with the new paths this can be removed.
  Also remove the router from app.js
 */


var express = require('express');
var router = express.Router();
var redditHandler = require('../api/reddit/redditHandler');

router.get('/reddit/login/:url', function (req, res, next) {
  redditHandler.beginLogin(req.session, req.params)
    .then((data) => {
      res.redirect(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/reddit/callback', function (req, res, next) {
  if (req.query.error) {
    next(new Error(req.query.error));
  }

  redditHandler.logIn(req.session, req.query)
    .then(() => {
      if (req.session.url) {
        res.redirect(decodeURIComponent(req.session.url));
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => {
      next(err);
    });
});


router.get('/reddit/logout', function (req, res, next) {
  redditHandler.logOut(req.session)
    .then(() => {
      req.session.destroy();
      res.redirect('/');
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
