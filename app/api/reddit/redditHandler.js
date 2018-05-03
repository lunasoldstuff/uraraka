var Snoocore = require('snoocore');
var redditAuthHandler = require('../auth/authHandler');
var redditServer = require('../auth/server');
var RedditRefreshToken = require('../../../models/redditRefreshToken');
var config = require('./config.js')
  .config();

const USERS = new Map();
const GUEST = new Snoocore(config);

/**
 * REDDIT API CALLS
 */
function getRefreshToken(userId, generatedState) {
  return new Promise((resolve, reject) => {
    RedditRefreshToken.findOne(
      {
        userId: userId,
        generatedState: generatedState
      },
      (err, data) => {
        if (err) reject(err);
        if (data) {
          if ((data || {})
            .refreshToken !== undefined) {
            resolve(data.refreshToken);
          } else {
            reject(new Error('refresh token not found'));
          }
        }
      }
    );
  });
}

// TODO: if unable to return refreshToken but session.userId exists user should be logged out
function getReddit(userId, generatedState) {
  return new Promise((resolve, reject) => {
    if (userId && generatedState) {
      if (USERS.has(generatedState)) {
        resolve(USERS.get(generatedState));
      } else {
        getRefreshToken(userId, generatedState)
          .then((data) => {
            let reddit = new Snoocore(config);
            reddit.refresh(data)
              .then(() => {
                USERS.set(generatedState, reddit);
                resolve(reddit);
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      }
    } else {
      resolve(GUEST);
    }
  });
}

exports.request = function (req, res, next, callback) {
  getReddit(req.session.userId, req.session.generatedState)
    .then((reddit) => {
      reddit(req.body.uri)[req.body.method](req.body.params)
        .then(function (data) {
          callback(null, data);
        })
        .catch(function (responseError) {
          callback(responseError, null);
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.config = function (req, res, next, callback) {
  getConfig(req.session.userId, req.session.generatedState)
    .then((data) => {

    })
    .catch((err) => {
      next(err);
    });
};
