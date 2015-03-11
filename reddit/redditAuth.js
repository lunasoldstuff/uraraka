var Snoocore = require('snoocore');
var when = require('when');
var open = require('open');
var config = require('./config.json');
var RedditUser = require('../models/redditUser.js');
var crypto = require('crypto');

var accounts = {};

// function refreshUser() {
// 	RedditUser.findOne({generatedState})
// }


exports.newInstance = function(generatedState) {
	var reddit = new Snoocore(config.userConfig);
	accounts[generatedState] = reddit;
	 setTimeout(function() {
      delete accounts[generatedState];
    }, 59 * 60 * 60 * 1000);
	return reddit.getExplicitAuthUrl(generatedState);
};

exports.completeAuth = function(generatedState, returnedState, code, error, callback) {
	console.log("[COMPLETE_AUTH] generatedState: " + generatedState + ", returnedState: " + returnedState);
	
	if (accounts[returnedState]) {
	    accounts[generatedState].auth(code).then(function(refreshToken){
	        console.log("[COMPLETE_AUTH] refresh token: " + refreshToken);
	 		
	        RedditUser.findOne({generatedState: generatedState}, function(err, returnedUser) {
	        	if (err) throw new error(err);
	        	if (returnedUser) {
	        		returnedUser.refreshToken = refreshToken;
	        		returnedUser.save(function(err){
	        			if (err) throw new error(err);
	        			callback();
	        		});
	        	} else {
	        		var newRedditUser = new RedditUser();
	        		newRedditUser.generatedState = generatedState;
	        		newRedditUser.refreshToken = refreshToken;
	        		newRedditUser.save(function(err){
	        			if (err) throw new error(err);
	        			callback();
	        		});
	        	}
	        });

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
    } else {
    	RedditUser.findOne({generatedState: generatedState}, function(err, data){
    		if (err) throw new error(err);
    		else {
    			//new reddit account and refresh
    			accounts[generatedState] = new Snoocore(config.userConfig);
    			accounts[generatedState].refresh(data.refreshToken).then(function(){
    				return when.resolve(accounts[generatedState]);
    			});
    		}
    	});
    }
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