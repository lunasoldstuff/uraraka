var Snoocore = require('snoocore');
var crypto = require('crypto');

var RedditUser = require('../../../models/redditUser');
var RedditRefreshToken = require('../../../models/redditRefreshToken');

var config = require('./config.js')
  .config();

const USER_REDDITS = new Map();
const GUEST_REDDIT = new Snoocore(config);

/**
 * REDDIT API CALLS
 */

function createRefreshToken(userId, generatedState, refreshToken) {
  return new Promise((resolve, reject) => {
    console.log('[authHandler] createRefreshToken()');
    // create and save the new refreshToken.
    let newRefreshToken = new RedditRefreshToken();
    // TODO: use destructuring
    newRefreshToken.userId = userId;
    newRefreshToken.createdAt = Date.now();
    newRefreshToken.generatedState = generatedState;
    newRefreshToken.refreshToken = refreshToken;

    newRefreshToken.save(function (err) {
      if (err) {
        console.log('[authHandler] createRefreshToken() reject error creating refreshToken');
        reject(err);
      } else {
        console.log('[authHandler] createRefreshToken() resolve created refreshToken');
        resolve();
      }
    });
  });
}


function getRefreshToken(userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] getRefreshToken() userId: ' + userId + ', generatedState: ' + generatedState);
    RedditRefreshToken.findOne(
      {
        userId: userId,
        generatedState: generatedState
      },
      (err, data) => {
        if (err) {
          console.log('[redditHandler] getRefreshToken() reject error finding refreshToken');
          reject(err);
        }
        if ((data || {})
          .refreshToken !== undefined) {
          console.log('[redditHandler] getRefreshToken() resolve refreshToken found');
          resolve(data.refreshToken);
        } else {
          console.log('[redditHandler] getRefreshToken() reject refreshToken wasnt found');
          reject(new Error('refresh token not found'));
        }
      }
    );
  });
}

function removeRefreshToken(userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] removeRefreshToken()');
    RedditRefreshToken.findOneAndRemove(
      {
        userId: userId,
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

function createUserReddit(userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] createUserReddit()');
    let reddit;

    getRefreshToken(userId, generatedState)
      .then((data) => {
        reddit = new Snoocore(config);
        return reddit.refresh(data);
      })
      .then(() => {
        USER_REDDITS.set(generatedState, reddit);
        console.log('[redditHandler] createUserReddit() resolve created reddit, saved in USER_REDDITS');
        resolve(reddit);
      })
      .catch((err) => {
        console.log('[redditHandler] createUserReddit() reject error creating reddit');
        reject(err);
      });
  });
}

function getUserReddit(userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] getUserReddit()');
    if (USER_REDDITS.has(generatedState)) {
      console.log('[redditHandler] getUserReddit() resolve user found in map');
      resolve(USER_REDDITS.get(generatedState));
    } else {
      console.log('[redditHandler] getUserReddit() user not found in map');
      createUserReddit(userId, generatedState)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          console.log('[redditHandler] getUserReddit() reject err');
          reject(err);
        });
    }
  });
}

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
      console.log('[redditHandler] getReddit() resolve GUEST_REDDIT reddit');
      resolve(GUEST_REDDIT);
    }
  });
}

function removeUserReddit(generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] removeUserReddit()');
    if (USER_REDDITS.has(generatedState)) {
      USER_REDDITS.get(generatedState)
        .deauth()
        .then(() => {
          USER_REDDITS.delete(generatedState);
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


function updateSession(session, update) {
  return new Promise((resolve, reject) => {
    Object.keys(update)
      .forEach((key) => {
        session[key] = update[key];
      });

    session.save((err) => {
      if (err) {
        console.log('[authHandler] updateSession() reject error saving session');
        reject(err);
      } else {
        console.log('[authHandler] updateSession() resolve session saved');
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
    console.log('[authHandler] createUser()');
    RedditUser.findOne(
      {
        id: id
      },
      (err, data) => {
        if (err) {
          console.log('[authHandler] createUser() reject error creating user');
          reject(err);
        } else if (!data) {
          console.log('[authHandler] createUser() creating new user');
          let newRedditUser = new RedditUser();
          newRedditUser.id = id;
          newRedditUser.name = name;
          // ({
          //   id: newRedditUser.id,
          //   name: newRedditUser.name
          // } = data); // TODO: this is the data from get info call above....

          newRedditUser.save((err) => {
            if (err) {
              console.log('[authHandler] createUser() reject error creating new user');
              reject(err);
            } else {
              console.log('[authHandler] createUser() resolve new user created');
              resolve();
            }
          });
        } else {
          console.log('[authHandler] createUser() user exists');
          resolve();
        }
      }
    );
  });
}

function subscribeToReddup(reddit) {
  return new Promise((resolve, reject) => {
    console.log('[authHandler] subscribeToRedup');
    reddit('/api/subscribe')
      .post({
        action: 'sub',
        sr: 't5_3cawe'
      })
      .then((data) => {
        console.log('[authHandler] subscribeToRedup resolve');
        resolve();
      })
      .catch((err) => {
        console.log('[authHandler] subscribeToRedup reject');
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
    console.log('[authHandler] registerUser');
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
            return createRefreshToken(me.id, GENERATED_STATE, refreshToken);
          })
          .then(() => {
            return subscribeToReddup(reddit);
          })
          .then(() => {
            console.log('[authHandler] registerUser resolve');
            resolve();
          })
          .catch((err) => {
            console.log('[authHandler] registerUser reject');
            reject(err);
          });
      } else {
        console.log('[authHandler] registerUser reject');
        reject(new Error('something went wrong logging you in'));
      }
    } else {
      console.log('[authHandler] registerUser reject');
      reject(new Error('something went wrong logging you in'));
    }
  });
};

exports.logOut = function ({
  userId,
  generatedState
}) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] removeUserReddit()');
    removeUserReddit(generatedState)
      .then(removeRefreshToken(userId, generatedState))
      .then(() => {
        console.log('[redditHandler] removeUserReddit() resolve');
        resolve();
      })
      .catch((err) => {
        console.log('[redditHandler] removeUserReddit() reject');
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
      console.log('[redditHandler] getConfig() resolve GUEST_REDDIT config');
      resolve({
        config: config
      });
    }
  });
};

exports.hasUserReddit = function (userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[redditHandler] hasUserReddit()');
    getUserReddit(userId, generatedState)
      .then((data) => {
        console.log('[redditHandler] hasUserReddit() resolve true');
        resolve(true);
      })
      .catch((err) => {
        console.log('[redditHandler] hasUserReddit() reject error');
        reject(err);
      });
  });
};
