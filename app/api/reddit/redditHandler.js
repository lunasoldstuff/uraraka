var Snoocore = require('snoocore');
var redditAuthHandler = require('../auth/authHandler');
var redditServer = require('../auth/server');

/**
 * REDDIT API CALLS
 */
exports.generic = function (req, res, next, callback) {
  redditServer.getRedditServer(req, res, next, function (reddit) {
    reddit(req.body.uri)[req.body.method](req.body.params)
      .then(function (data) {
        callback(null, data);
      })
      .catch(function (responseError) {
        callback(responseError, null);
      });
  });
};


exports.genericUser = function (req, res, next, callback) {
  redditAuthHandler.getInstance(req, res, next, function (reddit) {
    reddit(req.body.uri)[req.body.method](req.body.params)
      .then(function (data) {
        callback(null, data);
      })
      .catch(function (responseError) {
        callback(responseError, null);
      });
  });
};
