var express = require('express');
var router = express.Router();

var redditHandler = require('./redditHandler');

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
