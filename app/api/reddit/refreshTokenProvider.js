var RedditRefreshToken = require('../../../models/redditRefreshToken');


function create(userId, generatedState, refreshToken) {
  return new Promise((resolve, reject) => {
    console.log('[authHandler] create()');
    // create and save the new refreshToken.
    let newRefreshToken = new RedditRefreshToken();

    newRefreshToken.userId = userId;
    newRefreshToken.createdAt = Date.now();
    newRefreshToken.generatedState = generatedState;
    newRefreshToken.refreshToken = refreshToken;

    newRefreshToken.save(function (err) {
      if (err) {
        console.log('[authHandler] create() reject error creating refreshToken');
        reject(err);
      } else {
        console.log('[authHandler] create() resolve created refreshToken');
        resolve();
      }
    });
  });
}

function get(userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[refreshTokenProvider] get() userId: ' + userId + ', generatedState: ' + generatedState);
    RedditRefreshToken.findOne(
      {
        userId: userId,
        generatedState: generatedState
      },
      (err, data) => {
        if (err) {
          console.log('[refreshTokenProvider] get() reject error finding refreshToken');
          reject(err);
        }
        if ((data || {})
          .refreshToken !== undefined) {
          console.log('[refreshTokenProvider] get() resolve refreshToken found');
          resolve(data.refreshToken);
        } else {
          console.log('[refreshTokenProvider] get() reject refreshToken wasnt found');
          reject(new Error('refresh token not found'));
        }
      }
    );
  });
}

function remove(userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[refreshTokenProvider] remove()');
    RedditRefreshToken.findOneAndRemove(
      {
        userId: userId,
        generatedState: generatedState
      },
      function (err, doc, result) {
        if (err) {
          console.log('[refreshTokenProvider] remove() reject error removing refreshToken');
          reject(err);
        } else {
          console.log('[refreshTokenProvider] remove() resolve refreshToken removed');
          resolve();
        }
      }
    );
  });
}

exports.create = create;
exports.remove = remove;
exports.get = get;
