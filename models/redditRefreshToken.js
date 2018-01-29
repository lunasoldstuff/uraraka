var mongoose = require('mongoose');

var redditRefreshTokenSchema = mongoose.Schema({
	userId: String,
	createdAt: {
		type: Date,
		expires: 60 * 60 * 24 * 366
	},
	generatedState: String,
	refreshToken: String
});

module.exports = mongoose.model('RedditRefreshToken', redditRefreshTokenSchema);