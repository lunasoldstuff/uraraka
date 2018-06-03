var express = require('express');
var router = express.Router();
var userRedditProvider = require('./api/reddit/userRedditProvider');

var apiRouter = require('./api/apiRouter');

router.use('/api', apiRouter);

router.get('/partials/:name', function (req, res, next) {
  var name = req.params.name;
  res.render('partials/' + name);
});

router.get('*', function (req, res, next) {
  // console.log('[router *] path: ' + req.path);
  // console.log(`[router *] path: ${req.path}`);
  // console.log(`[router *] userId: ${req.session.userId}`);
  // console.log(`[router *] generatedState: ${req.session.generatedState}`);
  // console.log('[index.js *] typeof req.session.userid === \'undefined\': ' + typeof req.session.userId === 'undefined');
  /*
    Check for broken sessions.
    The user's browser has a session id and generatedState, but they are not found in our database.
    redirect the user to logout to destroy the session.
  */
  if (req.session.generatedState && req.session.userId) {
    userRedditProvider.has(req.session.userId, req.session.generatedState)
      .then((data) => {
        res.render('index', {
          title: 'reddup',
          isAuthenticated: true,
          userAgent: req.headers['user-agent']
        });
      })
      .catch((err) => {
        res.redirect('/api/reddit/logout');
      });
  } else {
    res.render('index', {
      title: 'reddup',
      isAuthenticated: false,
      userAgent: req.headers['user-agent']
    });
  }
});

module.exports = router;
