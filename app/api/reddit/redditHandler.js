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
    console.log('[redditHandler] getRefreshToken()');
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
            console.log('[redditHandler] getRefreshToken() resolve refreshToken found');
            resolve(data.refreshToken);
          } else {
            console.log('[redditHandler] getRefreshToken() reject refreshToken wasnt found');
            reject(new Error('refresh token not found'));
          }
        }
      }
    );
  });
}

function getUserReddit(userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] getUserReddit()');
    if (USERS.has(generatedState)) {
      console.log('[redditHandler] getUserReddit() resolve user found in map');
      resolve(USERS.get(generatedState));
    } else {
      let reddit;
      console.log('[redditHandler] getUserReddit() user not found in map');
      getRefreshToken(userId, generatedState)
        .then((data) => {
          reddit = new Snoocore(config);
          return reddit.refresh(data);
        })
        .then(() => {
          console.log('[redditHandler] getUserReddit() resolve user found in database');
          USERS.set(generatedState, reddit);
          resolve(reddit);
        })
        .catch((err) => {
          console.log('[redditHandler] getUserReddit() reject err');
          reject(err);
        });
    }
  });
}

// TODO: if unable to return refreshToken but session.userId exists user should be logged out
function getReddit(userId, generatedState) {
  console.log('[redditHandler] getReddit()');
  return new Promise((resolve, reject) => {
    if (userId && generatedState) {
      getUserReddit(userId, generatedState)
        .then((data) => {
          console.log('[redditHandler] getReddit() resolve user reddit');
          resolve(data);
        })
        .catch((err) => {
          console.log('[redditHandler] getReddit() reject error getting user reddit');
          reject(err);
        });
    } else {
      console.log('[redditHandler] getReddit() resolve guest reddit');
      resolve(GUEST);
    }
  });
}

function removeUser(generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] removeUser()');
    if (USERS.has(generatedState)) {
      USERS.get(generatedState)
        .deauth()
        .then(() => {
          USERS.delete(generatedState);
          console.log('[redditHandler] resolve user removed');
          resolve();
        })
        .catch((err) => {
          console.log('[redditHandler] reject error removing user');
          reject(err);
        });
    }
  });
}

function removeRefreshToken(id, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] removeRefreshToken()');
    RedditRefreshToken.findOneAndRemove(
      {
        userId: id,
        generatedState: generatedState
      },
      function (err, doc, result) {
        if (err) {
          console.log('[redditHandler] removeRefreshToken() reject error removing refreshToken');
          reject(err);
        } else {
          console.log('[redditHandler] removeRefreshToken() resolve refreshToken removed');
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
    console.log('[redditHandler] request()');
    getReddit(userId, generatedState)
      .then((reddit) => {
        return reddit(uri)[method](params);
      })
      .then(function (data) {
        console.log('[redditHandler] request() resolve request completed successfully');
        resolve(data);
      })
      .catch((err) => {
        console.log('[redditHandler] request() reject error fulfilling request');
        reject(err);
      });
  });
};

exports.getConfig = function (userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] getConfig()');
    if (userId && generatedState) {
      getRefreshToken(userId, generatedState)
        .then((data) => {
          console.log('[redditHandler] getConfig() resolve user config');
          resolve({
            refreshToken: data,
            config: config
          });
        })
        .catch((err) => {
          console.log('[redditHandler] getConfig() reject error getting user config');
          reject(err);
        });
    } else {
      console.log('[redditHandler] getConfig() resolve guest config');
      resolve({
        config: config
      });
    }
  });
};

exports.removeUser = function (id, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] removeUser()');
    removeUser(generatedState)
      .then(removeRefreshToken(id, generatedState))
      .then(() => {
        console.log('[redditHandler] removeUser() resolve');
        resolve();
      })
      .catch((err) => {
        console.log('[redditHandler] removeUser() reject');
        reject(err);
      });
  });
};

exports.hasUser = function (userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] hasUser()');
    getUserReddit(userId, generatedState)
      .then((data) => {
        console.log('[redditHandler] hasUser() resolve true');
        resolve(true);
      })
      .catch((err) => {
        console.log('[redditHandler] hasUser() reject error');
        reject(err);
      });
  });
};
