var Snoocore = require('snoocore');
var RedditUser = require('../../models/redditUser');
var RedditRefreshToken = require('../../models/redditRefreshToken');

var config = require('./config.js')
  .config();

exports.newInstance = function (generatedState) {
  let reddit = new Snoocore(config);
  return reddit.getExplicitAuthUrl(generatedState);
};

function saveInSession(session, id) {
  return new Promise((resolve, reject) => {
    session.userId = id;
    session.save((err) => {
      if (err) {
        reject(err);
      } else {
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
    RedditUser.findOne(
      {
        id: id
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else if (!data) {
          let newRedditUser = new RedditUser();
          newRedditUser.id = id;
          newRedditUser.name = name;
          // ({
          //   id: newRedditUser.id,
          //   name: newRedditUser.name
          // } = data); // TODO: this is the data from get info call above....

          newRedditUser.save((err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }
      }
    );
  });
}

function createRefreshToken(id, generatedState, refreshToken) {
  return new Promise((resolve, reject) => {
    // create and save the new refreshToken.
    let newRefreshToken = new RedditRefreshToken();
    // TODO: use destructuring
    newRefreshToken.userId = id;
    newRefreshToken.createdAt = Date.now();
    newRefreshToken.generatedState = generatedState;
    newRefreshToken.refreshToken = refreshToken;

    newRefreshToken.save(function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function subscribeToReddup(reddit) {
  return new Promise((resolve, reject) => {
    reddit('/api/subscribe')
      .post({
        action: 'sub',
        sr: 't5_3cawe'
      })
      .then((data) => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

exports.registerUser = function (session, {
  state,
  code,
  error
}) {
  return new Promise((resolve, reject) => {
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
          .catch((err) => {
            reject(err);
          });
      }
    } else {
      reject(new Error('something went wrong logging you in'));
    }
  });
};


// TODO: destructured parameters
// needs the session object to add stuff to it
exports.completeAuth = function (session, returnedState, code, error, callback) {
  var generatedState = session.generatedState;
  // Check states match.
  if (returnedState === generatedState) {
    let reddit = new Snoocore(config);

    reddit.auth(code)
      .then(function (refreshToken) {
        // Get user information. (userId)
        reddit('/api/v1/me')
          .get()
          .then(function (data) {
            // Add the user id to the session.
            // TODO: Multiple tasks, shoudl have their own functions and be chained.
            session.userId = data.id;
            session.save(function (err) {
              if (err) {
                throw new Error(err);
              }
            });

            // Search database by user id to see if they've logged in before.
            RedditUser.findOne(
              {
                id: data.id
              },
              function (err, data) {
                if (err) throw new Error(err);

                // This is a new user,
                // Create a record and store user inforamtion
                // and refreshToken:generatedState pair.
                if (!data) {
                  let newRedditUser = new RedditUser();
                  ({
                    id: newRedditUser.id,
                    name: newRedditUser.name
                  } = data);

                  newRedditUser.save(function (err) {
                  // TODO: wth is going on here with this error
                  // Who will catch it? should use next for error handling!
                    if (err) throw new Error(err);
                    // Subscribe the new user the r/reddupco
                    reddit('/api/subscribe')
                      .post({
                        action: 'sub',
                        sr: 't5_3cawe'
                      })
                      .then(function (data) {})
                      .catch(function (err) {
                      // TODO: Again throwing errors noone will catch...
                        if (err) throw new Error(err);
                      });
                  });
                }

                // create and save the new refreshToken.
                let newRefreshToken = new RedditRefreshToken();
                // TODO: use destructuring
                newRefreshToken.userId = data.id;
                newRefreshToken.createdAt = Date.now();
                newRefreshToken.generatedState = generatedState;
                newRefreshToken.refreshToken = refreshToken;

                newRefreshToken.save(function (err) {
                  if (err) throw new Error(err);
                  callback();
                });
              }
            );
          })
          .catch(function (err) {
            throw err;
          });
      });
  } else {
    // TODO: Again throwing error...
    throw new Error('Something went wrong trying to log you in. Please try again.');
  }
};


exports.logOut = function (req, res, next, callback) {
  /*
  deauthorize and remove
  reddit snoocore object
  fom the accounts store.
  */

  // TODO: need a logout function in redditHandler that deauth and removes user from USERS Map.
  // if (accounts[req.session.generatedState]) {
  //   // console.log('found account, removing');
  //   accounts[req.session.generatedState].deauth();
  //   delete accounts[req.session.generatedState];
  // }

  /*
  Remove refreshToken from database.
  */
  RedditRefreshToken.findOneAndRemove(
    {
      userId: req.session.userId,
      generatedState: req.session.generatedState
    },
    function (err, doc, result) {
      if (err) {
      // console.log('[logout] err')
        next(err);
      }
      callback();
    }
  );
};
