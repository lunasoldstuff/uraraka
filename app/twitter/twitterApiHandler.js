var Twitter = require('twitter');
var winston = require('winston');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

exports.status = function (id, callback) {
  client.get(
    'statuses/oembed',
    {
      id: id
    },
    function (err, tweet, response) {
      if (err) {
        winston.log('error', err);
      }
      callback(tweet);
    }
  );
};
