var mongoose = require('mongoose');

var redditUserSchema = mongoose.Schema({
	reddit: {
		id: String,
		refreshToken: String,
		accessToken: String,
	}
});

module.exports = mongoose.model('RedditUser', redditUserSchema);