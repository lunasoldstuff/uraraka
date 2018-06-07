var express = require('express');
var router = express.Router();

var redditHandler = require('./redditHandler');

router.get('/login/:url', function (req, res, next) {
  redditHandler.beginLogin(req.session, req.params)
    .then((data) => {
      res.redirect(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/callback', function (req, res, next) {
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


router.get('/logout', function (req, res, next) {
  redditHandler.logOut(req.session)
    .then(() => {
      req.session.destroy();
      res.redirect('/');
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/request', function (req, res, next) {
  redditHandler.request(req.session, req.body)
    .then((data) => {
      res.json({
        transportWrapper: data
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/config', function (req, res, next) {
  redditHandler.getConfig(req.session.userId, req.session.generatedState)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
