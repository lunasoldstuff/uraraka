var Snoocore = require('snoocore');
var when = require('when');
var open = require('open');
// var config = require('./config.json');
var config = require('../common.js').config();
var RedditUser = require('../models/redditUser.js');
var crypto = require('crypto');
var accounts = {};
var accountTimeout = 59 * 60 * 1000;

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

        	setTimeout(function() {
        		console.log('ACCOUNT TIMEOUT');
			  	refreshAccessToken(generatedState, refreshToken, callback);
			}, accountTimeout);

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
	        		// console.log('create new RedditUser, generatedState: ' + generatedState +
					// ", refreshToken: " + refreshToken);
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
    			
    			refreshAccessToken(generatedState, data.refreshToken, function(){
    				return when.resolve(accounts[generatedState]);
    			});
    			
    			// accounts[generatedState].refresh(data.refreshToken).then(function(){
    			// 	return when.resolve(accounts[generatedState]);
    			// });
    		}
    	});
    }
};

exports.removeInstance = function(generatedState) {
	if (accounts[generatedState]) {
		console.log('found account, removing');
		accounts[generatedState].deauth();
		delete accounts[generatedState];
	}

	RedditUser.remove({generatedState: generatedState}, function(err){
		console.log("removing from database");
	});
};

//TODO need to improve, what if not authenticated yet...
exports.isLoggedIn = function(generatedState, callback) {

	if (typeof(generatedState) === 'undefined' || generatedState === null) {
		console.log('[isLoggedIn] false');
		callback(false);
	} else {
		if (accounts[generatedState]) {
			console.log('[isLoggedIn] accounts[generatedState] found, generatedState: ' + generatedState);
			callback(true);
	    }

		else {
			console.log('[isLoggedIn] accounts[generatedState] not found, generatedState: ' + generatedState);
			console.log('[isLoggedIn] searching database...');

			RedditUser.findOne({generatedState: generatedState}, function(err, data){

				if (err) throw new error(err);

				if (data) {
					//new reddit account and refresh
					console.log('[isLoggedIn] accounts[generatedState] found in database, generatedState: ' + generatedState);
					accounts[generatedState] = new Snoocore(config.userConfig);
	    			refreshAccessToken(generatedState, data.refreshToken, callback);
	    	
	    		} else {
					callback(false);
				}

	    	});

	    }
	}
};

function refreshAccessToken(generatedState, refreshToken, callback) {
	
	if (accounts[generatedState]) {
		 
		accounts[generatedState].refresh(refreshToken).then(function(){
			console.log('ACCOUNT REFRESHED');
        	setTimeout(function() {
        		console.log('ACCOUNT TIMEOUT');
			  	refreshAccessToken(generatedState, refreshToken, null);
			}, accountTimeout);
			if (callback)
				callback(true);					
		});		
	}
}