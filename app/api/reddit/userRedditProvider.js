var Snoocore = require('snoocore');
var refreshTokenProvider = require('./refreshTokenProvider');
var config = require('./config.js')
  .config();

const USER_REDDITS = new Map();

function create(userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[userRedditProvider] create()');
    let reddit;

    refreshTokenProvider.get(userId, generatedState)
      .then((data) => {
        reddit = new Snoocore(config);
        return reddit.refresh(data);
      })
      .then(() => {
        USER_REDDITS.set(generatedState, reddit);
        console.log('[userRedditProvider] create() resolve created reddit, saved in USER_REDDITS');
        resolve(reddit);
      })
      .catch((err) => {
        console.log('[userRedditProvider] create() reject error creating reddit');
        reject(err);
      });
  });
}

function get(userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[userRedditProvider] get()');
    if (USER_REDDITS.has(generatedState)) {
      console.log('[userRedditProvider] get() resolve user found in map');
      resolve(USER_REDDITS.get(generatedState));
    } else {
      console.log('[userRedditProvider] get() user not found in map');
      create(userId, generatedState)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          console.log('[userRedditProvider] get() reject err');
          reject(err);
        });
    }
  });
}

function remove(generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[userRedditProvider] remove()');
    if (USER_REDDITS.has(generatedState)) {
      USER_REDDITS.get(generatedState)
        .deauth()
        .then(() => {
          USER_REDDITS.delete(generatedState);
          console.log('[userRedditProvider] resolve user removed');
          resolve();
        })
        .catch((err) => {
          console.log('[userRedditProvider] reject error removing user');
          reject(err);
        });
    } else {
      resolve();
    }
  });
}

function has(userId, generatedState) {
  return new Promise((resolve, reject) => {
    console.log('[userRedditProvider] hasUserReddit()');
    get(userId, generatedState)
      .then((data) => {
        console.log('[userRedditProvider] hasUserReddit() resolve true');
        resolve(true);
      })
      .catch((err) => {
        console.log('[userRedditProvider] hasUserReddit() reject error');
        reject(err);
      });
  });
}

exports.get = get;
exports.remove = remove;
exports.has = has;
