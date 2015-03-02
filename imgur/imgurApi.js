var imgur = require('imgur');
var config = require('./config.json');

imgur.setClientId(config.clientid);
console.log('[IMGUR CLIENT ID] ' + imgur.getClientId());

exports.image = function(id, callback) {
	console.log('[IMGUR Image]');
	imgur.getInfo(id)
    .then(function(json) {
        callback(json);
    })
    .catch(function (err) {
        console.error(err.message);
    });
}

exports.album = function(id, callback) {
	console.log('[IMGUR Album]');
	imgur.getAlbumInfo(id)
	    .then(function(json) {
	    	callback(json);
	    })
	    .catch(function (err) {
	        console.error(err.message);
	    });
};
