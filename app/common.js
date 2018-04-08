var env = require('./env.json');

exports.config = function() {
	var node_env = process.env.NODE_ENV || 'development';
	var config = env[node_env];
	config.oauth.key = process.env.REDDIT_API_KEY;
	config.oauth.secret = process.env.REDDIT_API_SECRET;
	return config;
};