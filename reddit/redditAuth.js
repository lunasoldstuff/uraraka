var Snoocore = require('snoocore');
var when = require('when');
var open = require('open');
var config = require('./config.json');
var RedditUser = require('../models/redditUser.js');
var crypto = require('crypto');

var accounts = {};

exports.newInstance = function(generatedState) {
	var reddit = new Snoocore(config.userConfig);
	accounts[generatedState] = reddit;
	return reddit.getExplicitAuthUrl(generatedState);
};

exports.completeAuth = function(generatedState, returnedState, code, error, callback) {
	console.log("[COMPLETE_AUTH] generatedState: " + generatedState + ", returnedState: " + returnedState);
	
	if (accounts[returnedState]) {
	    accounts[generatedState].auth(code).then(function(refreshToken){
	        console.log("[COMPLETE_AUTH] refresh token: " + refreshToken);
	 		//need to save the refresh token in db....for later refreshes
	        callback();
	    });
	} else {
	    console.log("Error states do not match...");
	    console.error('generatedState:', generatedState);
	    console.error('returnedState:', returnedState);
	}
};

exports.getInstance = function(generatedState) {
	if (accounts[generatedState]) {
        return when.resolve(accounts[generatedState]);
    }
    // throw new Error ('[getInstance]: generatedState not found:', generatedState);
    
};

exports.removeInstance = function(generatedState) {
	accounts[generatedState].deauth();
	delete accounts[generatedState];
};

//TODO need to improve, what is not authenticated yet...
exports.isLoggedIn = function(generatedState) {
	if(accounts[generatedState])
		return true;
	return false;
};