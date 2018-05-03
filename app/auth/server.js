var Snoocore = require('snoocore');
var when = require('when');
var open = require('open');
var config = require('./config.js')
  .config();
var crypto = require('crypto');
var winston = require('winston');

var serverGeneratedState = crypto.randomBytes(32)
  .toString('hex');
var redditServer;
var serverTimeout = 59 * 60 * 1000;

redditServer = new Snoocore(config);

exports.getRedditServer = function (req, res, next, callback) {
  if (redditServer !== null && typeof redditServer !== 'undefined') {
    when.resolve(redditServer)
      .then(function (reddit) {
        callback(reddit);
      });
  } else {
    redditServer = new Snoocore(config);

    when.resolve(redditServer)
      .then(function (reddit) {
        callback(reddit);
      });
  }
};
