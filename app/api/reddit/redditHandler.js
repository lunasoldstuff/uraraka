var Snoocore = require('snoocore');
var crypto = require('crypto');

var RedditUser = require('../../../models/redditUser');

var userRedditProvider = require('./userRedditProvider');
var refreshTokenProvider = require('./refreshTokenProvider');

var config = require('./config.js')
  .config();

const GUEST_REDDIT = new Snoocore(config);

/**
 * REDDIT API CALLS
 */

function getReddit(userId, generatedState) {
  // console.log('[redditHandler] getReddit()');
  return new Promise((resolve, reject) => {
    if (userId && generatedState) {
      userRedditProvider.get(userId, generatedState)
        .then((data) => {
          // console.log('[redditHandler] getReddit() resolve user reddit');
          resolve(data);
        })
        .catch((err) => {
          // console.log('[redditHandler] getReddit() reject error getting user reddit');
          reject(err);
        });
    } else {
      // console.log('[redditHandler] getReddit() resolve GUEST_REDDIT reddit');
      resolve(GUEST_REDDIT);
    }
  });
}


function updateSession(session, update) {
  return new Promise((resolve, reject) => {
    Object.keys(update)
      .forEach((key) => {
        session[key] = update[key];
      });

    session.save((err) => {
      if (err) {
        // console.log('[authHandler] updateSession() reject error saving session');
        reject(err);
      } else {
        // console.log('[authHandler] updateSession() resolve session saved');
        resolve();
      }
    });
  });
}

function createUser({
  id,
  name
}) {
  return new Promise((resolve, reject) => {
    // console.log('[authHandler] createUser()');
    RedditUser.findOne(
      {
        id: id
      },
      (err, data) => {
        if (err) {
        // console.log('[authHandler] createUser() reject error creating user');
          reject(err);
        } else if (!data) {
        // console.log('[authHandler] createUser() creating new user');
          let newRedditUser = new RedditUser();
          newRedditUser.id = id;
          newRedditUser.name = name;

          newRedditUser.save((err) => {
            if (err) {
            // console.log('[authHandler] createUser() reject error creating new user');
              reject(err);
            } else {
            // console.log('[authHandler] createUser() resolve new user created');
              resolve();
            }
          });
        } else {
        // console.log('[authHandler] createUser() user exists');
          resolve();
        }
      }
    );
  });
}

function subscribeToReddup(reddit) {
  return new Promise((resolve, reject) => {
    // console.log('[authHandler] subscribeToRedup');
    reddit('/api/subscribe')
      .post({
        action: 'sub',
        sr: 't5_3cawe'
      })
      .then((data) => {
        // console.log('[authHandler] subscribeToRedup resolve');
        resolve();
      })
      .catch((err) => {
        // console.log('[authHandler] subscribeToRedup reject');
        reject(err);
      });
  });
}

exports.beginLogin = function (session, params) {
  return new Promise((resolve, reject) => {
    let generatedState = crypto.randomBytes(32)
      .toString('hex');

    updateSession(session, {
      generatedState: generatedState,
      url: params.url
    })
      .then(() => {
        resolve(GUEST_REDDIT.getExplicitAuthUrl(generatedState));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.logIn = function (session, {
  state,
  code,
  error
}) {
  return new Promise((resolve, reject) => {
    // console.log('[authHandler] registerUser');
    if (state && code) {
      const GENERATED_STATE = session.generatedState;

      if (state === GENERATED_STATE) {
        let reddit = new Snoocore(config);
        let refreshToken;
        let me;

        reddit.auth(code)
          .then((data) => {
            refreshToken = data;
            return reddit('/api/v1/me')
              .get();
          })
          .then((data) => {
            me = data;
            return updateSession(session, {
              userId: me.id
            });
          })
          .then(() => {
            return createUser(me);
          })
          .then(() => {
            return refreshTokenProvider.create(me.id, GENERATED_STATE, refreshToken);
          })
          .then(() => {
            return subscribeToReddup(reddit);
          })
          .then(() => {
            // console.log('[authHandler] registerUser resolve');
            resolve();
          })
          .catch((err) => {
            // console.log('[authHandler] registerUser reject');
            reject(err);
          });
      } else {
        // console.log('[authHandler] registerUser reject');
        reject(new Error('something went wrong logging you in'));
      }
    } else {
      // console.log('[authHandler] registerUser reject');
      reject(new Error('something went wrong logging you in'));
    }
  });
};

exports.logOut = function ({
  userId,
  generatedState
}) {
  return new Promise((resolve, reject) => {
    // console.log('[redditHandler] removeUserReddit()');
    userRedditProvider.remove(generatedState)
      .then(() => {
        // console.log('[redditHandler] remove refresh token...');
        return refreshTokenProvider.remove(userId, generatedState);
      })
      .then(() => {
        // console.log('[redditHandler] removeUserReddit() resolve');
        resolve();
      })
      .catch((err) => {
        // console.log('[redditHandler] removeUserReddit() reject');
        reject(err);
      });
  });
};

exports.request = function ({
  userId,
  generatedState
}, {
  uri,
  method,
  params
}) {
  return new Promise((resolve, reject) => {
    // console.log('[redditHandler] request()');
    getReddit(userId, generatedState)
      .then((reddit) => {
        return reddit(uri)[method](params);
      })
      .then(function (data) {
        // console.log('[redditHandler] request() resolve request completed successfully');
        resolve(data);
      })
      .catch((err) => {
        // console.log('[redditHandler] request() reject error fulfilling request');
        reject(err);
      });
  });
};

exports.getConfig = function (userId, generatedState) {
  return new Promise((resolve, reject) => {
    // console.log('[redditHandler] getConfig()');
    if (userId && generatedState) {
      refreshTokenProvider.get(userId, generatedState)
        .then((data) => {
          // console.log('[redditHandler] getConfig() resolve user config');
          resolve({
            refreshToken: data,
            config: config
          });
        })
        .catch((err) => {
          // console.log('[redditHandler] getConfig() reject error getting user config');
          reject(err);
        });
    } else {
      // console.log('[redditHandler] getConfig() resolve GUEST_REDDIT config');
      resolve({
        config: config
      });
    }
  });
};
