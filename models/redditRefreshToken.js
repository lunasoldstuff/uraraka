var mongoose = require('mongoose');

var redditRefreshTokenSchema = mongoose.Schema({
	userId: String,
	createdAt: {
		type: Date
	},
	generatedState: String,
	refreshToken: String
});

module.exports = mongoose.model('RedditRefreshToken', redditRefreshTokenSchema);