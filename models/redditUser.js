var mongoose = require('mongoose');

var redditUserSchema = mongoose.Schema({
	reddit: {
		generatedState: String,
		refreshToken: String,
	}
});

module.exports = mongoose.model('RedditUser', redditUserSchema);