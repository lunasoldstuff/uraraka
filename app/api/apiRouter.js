var express = require('express');
var router = express.Router();

var twitterRouter = require('./twitter/twitterApiRouter');
var paypalRouter = require('./paypal/paypalRouter');
var mailRouter = require('./mail/mailRouter');
var settingsRouter = require('./settings/settingsRouter');
var redditRouter = require('./reddit/redditRouter');

router.use('/twitter', twitterRouter);
router.use('/paypal', paypalRouter);
router.use('/mail', mailRouter);
router.use('/settings', settingsRouter);
router.use('/reddit', redditRouter);

module.exports = router;
