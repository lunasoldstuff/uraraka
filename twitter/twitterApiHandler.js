var Twitter = require('twitter');
var twitterConfig = require('./config.json');

var client = new Twitter(twitterConfig);

exports.status = function(id, callback) {
	client.get('statuses/oembed', {id: id}, function(err, tweet, response){
		if (err){
			console.log('Twitter Error');
			console.error(err);
		}
		console.log(JSON.stringify(tweet));
		callback(tweet);
	});
};

