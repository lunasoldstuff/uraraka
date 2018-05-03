var express = require('express');
var router = express.Router();
var redditAuthHandler = require('./reddit/redditAuthHandler');
var settingsHandler = require('./settingsHandler');

router.get('/partials/:name', function (req, res, next) {
  var name = req.params.name;
  res.render('partials/' + name);
});

router.get('/settingsapi', function (req, res, next) {
  settingsHandler.getSettings(req.session)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/settingsapi', function (req, res, next) {
  settingsHandler.setSettings(req.session, req.body.settings)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/throwError', function (req, res, next) {
  next(new Error('test error'));
});

router.get('*', function (req, res, next) {
  // console.log('[index.js *] typeof req.session.userid === \'undefined\': ' + typeof req.session.userId === 'undefined');
  /*
    Check for broken sessions.
    The user's browser has a session id and generatedState, but they are not found in our database.
    redirect the user to logout to destroy the session.
  */
  if (req.session.generatedState && req.session.userId) {
    redditAuthHandler.getInstance(req, res, next, function (reddit) {
      if (!reddit) {
        res.redirect('/auth/reddit/logout');
      } else {
        res.render('index', {
          title: 'reddup',
          authenticated: true,
          userAgent: req.headers['user-agent']
        });
      }
    });
  } else {
    res.render('index', {
      title: 'reddup',
      authenticated: false,
      userAgent: req.headers['user-agent']
    });
  }
});

module.exports = router;
