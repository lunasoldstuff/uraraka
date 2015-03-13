var mongoose = require('mongoose');

var redditUserSchema = mongoose.Schema({
	generatedState: String,
	refreshToken: String,
});

module.exports = mongoose.model('RedditUser', redditUserSchema);