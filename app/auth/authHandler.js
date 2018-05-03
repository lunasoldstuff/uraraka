var Snoocore = require('snoocore');
var when = require('when');
var open = require('open');
var RedditUser = require('../../models/redditUser');
var RedditRefreshToken = require('../../models/redditRefreshToken');
var config = require('./config.js')
  .config();
var crypto = require('crypto');
var winston = require('winston');

var accounts = {};
// refresh the access token every 59 minutes.
var REFRESH_TIMEOUT = 59 * 60 * 1000;
var ACCOUNT_TIMEOUT = 13 * 24 * 60 * 60 * 1000;

exports.newInstance = function (generatedState) {
  var reddit = new Snoocore(config);
  return reddit.getExplicitAuthUrl(generatedState);
};

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
            session.userId = data.id;
            session.save(function (err) {
              if (err) throw new Error(err);
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
                  // TODO could use object destructuring here.
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


// Might have to update the createdAt date when the account is accessed through just the in memory object as well.
exports.getInstance = function (req, res, next, callback) {
  // console.log('[redditAuthHandler] getInstance() generatedState: ' + req.session.generatedState + ', req.session.userId: ' + req.session.userId);

  if (accounts[req.session.generatedState]) {
    // console.log('[redditAuthHandler] getInstance() Returning reddit object from accounts[]');
    when
      .resolve(accounts[req.session.generatedState])
      .then(function (reddit) {
        callback(reddit);
      })
      .catch(function (error) {
        next(error);
      });
  } else {
    // console.log('[redditAuthHandler] getInstance() search db for refresh token...');

    RedditRefreshToken.findOne(
      {
        userId: req.session.userId,
        generatedState: req.session.generatedState
      },
      function (err, data) {
        if (err) next(err);
        if (data) {
        // console.log('[redditAuthHandler] getInstance() refresh token found, data.refreshToken: ' + data.refreshToken);
        // update created at date on refreshToken
          data.createdAt = Date.now();

          data.save(function (err) {
            if (err) next(err);
          // console.log('[redditAuthHandler] getInstance() REFRESH TOKEN CREATED AT UPDATED...');
          });

          // new reddit account and refresh
          accounts[req.session.generatedState] = new Snoocore(config);

          setTimeout(function () {
          // console.log('ACCOUNT TIMEOUT');
            if (accounts[req.session.generatedState]) delete accounts[req.session.generatedState];
          }, ACCOUNT_TIMEOUT);

          refreshAccessToken(data.generatedState, data.refreshToken, function (err) {
            if (err) throw err;
            // console.log('[redditAuthHandler] getInstance() SNOOCORE OBJ REFRESHED...');
            when.resolve(accounts[req.session.generatedState])
              .then(function (reddit) {
                callback(reddit);
              });
          });
        } else {
        // console.log('[redditAuthHandler] getInstance() no refresh token found');
          callback(false);
        }
      }
    );
  }
};

// TODO should not need to do this, snoocore will handle it automatically.
function refreshAccessToken(generatedState, refreshToken, callback) {
  // console.log('[redditAuthHandler] refreshAccessToken');

  if (accounts[generatedState]) {
    accounts[generatedState]
      .refresh(refreshToken)
      .then(function () {
        // console.log('ACCOUNT REFRESHED');

        setTimeout(function () {
          // console.log('ACCOUNT TIMEOUT');
          refreshAccessToken(generatedState, refreshToken);
        }, REFRESH_TIMEOUT);

        if (callback) callback();
      })
      .catch(function (err) {
        if (callback) callback(err);
      });
  } else if (callback) callback(new Error('error refreshing reddit account. account not found.'));
}

exports.logOut = function (req, res, next, callback) {
  /*
		deauthorize and remove
		reddit snoocore object
		fom the accounts store.
	 */

  if (accounts[req.session.generatedState]) {
    // console.log('found account, removing');
    accounts[req.session.generatedState].deauth();
    delete accounts[req.session.generatedState];
  }

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
