var mongoose = require('mongoose');

var redditUserSchema = mongoose.Schema({
    id: String,
    name: String,
    settings: Object,
    subscriptionId: String
});

module.exports = mongoose.model('RedditUser', redditUserSchema);