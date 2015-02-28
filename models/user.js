var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	reddit: {
		id: String,
		refreshToken: String,
		accessToken: String,
	}
});

module.exports = mongoose.model('User', userSchema);