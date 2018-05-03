var express = require('express');
var router = express.Router();
var authHandler = require('./auth/authHandler');

var apiRouter = require('./api/apiRouter');

router.use('/api', apiRouter);

router.get('/partials/:name', function (req, res, next) {
  var name = req.params.name;
  res.render('partials/' + name);
});

router.get('*', function (req, res, next) {
  // console.log('[index.js *] typeof req.session.userid === \'undefined\': ' + typeof req.session.userId === 'undefined');
  /*
    Check for broken sessions.
    The user's browser has a session id and generatedState, but they are not found in our database.
    redirect the user to logout to destroy the session.
  */
  if (req.session.generatedState && req.session.userId) {
    authHandler.getInstance(req, res, next, function (reddit) {
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
