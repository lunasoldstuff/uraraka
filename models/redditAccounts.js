var mongoose = require('mongoose');

var redditAccountsSchema = mongoose.Schema({
	accounts: Object
});

module.exports = mongoose.model('RedditAccounts', redditAccountsSchema);