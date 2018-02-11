var Twitter = require('twitter');
var twitterConfig = require('./config.json');
var winston = require('winston');

var client = new Twitter(twitterConfig);

exports.status = function(id, callback) {
    client.get('statuses/oembed', {
        id: id
    }, function(err, tweet, response) {
        if (err) {
            winston.log('error', err);
        }
        callback(tweet);
    });
};