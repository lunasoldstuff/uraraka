var express = require('express');
var router = express.Router();

var redditApiHandler = require('./redditApiHandler');

// used for debugging error handlers
router.get('/throwError', function (req, res, next) {
  next(new Error('test error'));
});

router.post('/reddit', function (req, res, next) {
  if (req.session.userId) {
    redditApiHandler.genericUser(req, res, next, function (err, data) {
      if (err) {
        next(err);
      } else {
        res.json({
          // TODO: have a look at this transportWrapper stuff, must be a better way to do this...
          transportWrapper: data
        });
      }
    });
  } else {
    redditApiHandler.generic(req, res, next, function (err, data) {
      if (err) {
        next(err);
      } else {
        res.json({
          transportWrapper: data
        });
      }
    });
  }
});

module.exports = router;
