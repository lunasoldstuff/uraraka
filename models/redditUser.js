var mongoose = require('mongoose');

var refreshTokenSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        expires: 15
    },
    generatedState: String,
    refreshToken: String
});

var redditUserSchema = mongoose.Schema({
    id: String,
    name: String,
    settings: Object,
    refreshTokens: [refreshTokenSchema]
});

module.exports = mongoose.model('RedditUser', redditUserSchema);
