var mongoose = require('mongoose');

var redditUserSchema = mongoose.Schema({
	generatedState: String,
	refreshToken: String,
	name: String,
	id: String,
	settings: Object
});

module.exports = mongoose.model('RedditUser', redditUserSchema);