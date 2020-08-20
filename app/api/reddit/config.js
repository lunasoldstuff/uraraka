var configs = {
  development: {
    userAgent: 'https://www.reddup.co:v0.8.8 (by /u/xCavemanNinjax)',
    oauth: {
      type: 'explicit',
      duration: 'permanent',
      redirectUri: 'http://localhost:5000/api/reddit/callback',
      scope: [
        'identity',
        'edit',
        'flair',
        'history',
        'mysubreddits',
        'privatemessages',
        'read',
        'report',
        'save',
        'submit',
        'subscribe',
        'vote',
        'creddits'
      ]
    }
  },
  production: {
    userAgent: 'https://uraraka.herokuapp.com:v0.8.8 (by /u/Droobledores)',
    oauth: {
      type: 'explicit',
      duration: 'permanent',
      redirectUri: 'https://uraraka.herokuapp.com/api/reddit/callback',
      scope: [
        'identity',
        'edit',
        'flair',
        'history',
        'mysubreddits',
        'privatemessages',
        'read',
        'report',
        'save',
        'submit',
        'subscribe',
        'vote',
        'creddits'
      ]
    }
  }
};

exports.config = function () {
  var nodeEnv = process.env.NODE_ENV || 'development';
  var config = configs[nodeEnv];
  config.oauth.key = process.env.REDDIT_API_KEY;
  config.oauth.secret = process.env.REDDIT_API_SECRET;
  return config;
};
