var express = require('express');
var router = express.Router();
var settingsHandler = require('./settingsHandler');

router.get('/settings', function (req, res, next) {
  settingsHandler.getSettings(req.session)
    .then((data) => {
      Object.keys(data)
        .forEach((key) => console.log('\n' + key));
      res.json({
        settings: data
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/settings', function (req, res, next) {
  settingsHandler.setSettings(req.session, req.body.settings)
    .then((data) => {
      res.json({
        settings: data
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
