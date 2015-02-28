var mongoose = require('mongoose');

var redditAppSchema = mongoose.Schema({
	refreshToken: String
});

module.exports = mongoose.model('RedditApp', redditAppSchema);