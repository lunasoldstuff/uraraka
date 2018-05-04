var Snoocore = require('snoocore');
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

function getUserReddit(userId, generatedState) {
  return new Promise((resolve, reject) => {
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
  });
}

// TODO: if unable to return refreshToken but session.userId exists user should be logged out
function getReddit(userId, generatedState) {
  return new Promise((resolve, reject) => {
    if (userId && generatedState) {
      getUserReddit(userId, generatedState)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      resolve(GUEST);
    }
  });
}

function removeUser(generatedState) {
  return new Promise((resolve, reject) => {
    if (USERS.has(generatedState)) {
      USERS.get(generatedState)
        .deauth()
        .then(() => {
          USERS.delete(generatedState);
          resolve();
        });
    }
  });
}

function removeRefreshToken(id, generatedState) {
  return new Promise((resolve, reject) => {
    RedditRefreshToken.findOneAndRemove(
      {
        userId: id,
        generatedState: generatedState
      },
      function (err, doc, result) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
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

exports.removeUser = function (id, generatedState) {
  return new Promise((resolve, reject) => {
    removeUser(generatedState)
      .then(removeRefreshToken(id, generatedState))
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.hasUser = function (userId, generatedState) {
  return new Promise((resolve, reject) => {
    getUserReddit(userId, generatedState)
      .then((data) => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
