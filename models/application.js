var mongoose = require('mongoose');

var applicationSchema = mongoose.Schema({
	refreshToekn: String
});

module.exports = mongoose.model('Application', userSchema);