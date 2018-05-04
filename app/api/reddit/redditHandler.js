var Snoocore = require('snoocore');
var redditAuthHandler = require('../auth/authHandler');
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
            reddit.refresh(data);
          })
          .then((data) => {
            USERS.set(generatedState, data);
            resolve(data);
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

exports.request = function ({
  userId,
  generatedState
}, {
  uri,
  method,
  params
}) {
  return new Promise((resolve, reject) => {
    getReddit(userId, generatedState)
      .then((reddit) => {
        reddit(uri)[method](params);
      })
      .then(function (data) {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getConfig = function (userId, generatedState) {
  return new Promise((resolve, reject) => {
    if (userId && generatedState) {
      getRefreshToken(userId, generatedState)
        .then((data) => {
          resolve({
            refreshToken: data,
            config: config
          });
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      resolve({
        config: config
      });
    }
  });
};
