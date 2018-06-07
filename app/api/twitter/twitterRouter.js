var express = require('express');
var router = express.Router();
var twitterHandler = require('./twitterHandler');

router.get('/status/:id', function (req, res, next) {
  twitterHandler.status(req.params.id, function (err, data) {
    if (err) {
      next(err);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
