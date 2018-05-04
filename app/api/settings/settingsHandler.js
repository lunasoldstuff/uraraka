var RedditUser = require('../../../models/redditUser.js');

exports.getSettings = function (session) {
  const defaultSettings = {
    loadDefaults: true
  };

  const {
    userId
  } = session;

  return new Promise((resolve, reject) => {
    if (userId) {
      RedditUser.findOne({
        id: userId
      }, (err, data) => {
        if (err) {
          reject(err);
        }
        if ((data || {})
          .settings) {
          resolve(data.settings);
        } else {
          resolve(defaultSettings);
        }
      });
    } else if (session.settings) {
      resolve(session.settings);
    } else {
      resolve(defaultSettings);
    }
  });
};

exports.setSettings = function (session, settings) {
  const {
    userId
  } = session;
  return new Promise((resolve, reject) => {
    if (userId) {
      RedditUser.findOne({
        id: userId
      }, (err, data) => {
        if (err) {
          reject(err);
        } else if (data) {
          data.settings = settings;
          data.save((err) => {
            if (err) {
              reject(err);
            } else {
              resolve(data.settings);
            }
          });
        }
      });
    } else {
      session.settings = settings;
      session.save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(session.settings);
        }
      });
    }
  });
};
