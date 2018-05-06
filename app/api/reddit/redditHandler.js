var Snoocore = require('snoocore');
var crypto = require('crypto');

var RedditUser = require('../../../models/redditUser');
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

// TODO: modify to take any arguments and  save them in session.
function saveInSession(session, userId) {
  return new Promise((resolve, reject) => {
    console.log('[authHandler] saveInSession()');
    session.userId = userId;
    session.save((err) => {
      if (err) {
        console.log('[authHandler] saveInSession() reject error saving session');
        reject(err);
      } else {
        console.log('[authHandler] saveInSession() resolve session saved');
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

function createRefreshToken(id, generatedState, refreshToken) {
  return new Promise((resolve, reject) => {
    console.log('[authHandler] createRefreshToken()');
    // create and save the new refreshToken.
    let newRefreshToken = new RedditRefreshToken();
    // TODO: use destructuring
    newRefreshToken.userId = id;
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

exports.newInstance = function (generatedState) {
  let reddit = new Snoocore(config);
  return reddit.getExplicitAuthUrl(generatedState);
};

exports.beginLogin = function (session, params) {
  return new Promise((resolve, reject) => {
    let generatedState = crypto.randomBytes(32)
      .toString('hex');

    // TODO: use save in session.
    session.generatedState = generatedState;
    session.url = params.url;

    session.save((err) => {
      if (err) {
        reject(err);
      } else {
        let reddit = new Snoocore(config);
        resolve(reddit.getExplicitAuthUrl(generatedState));
      }
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
            return saveInSession(session, me.id);
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
    console.log('[redditHandler] removeUser()');
    removeUser(generatedState)
      .then(removeRefreshToken(userId, generatedState))
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
