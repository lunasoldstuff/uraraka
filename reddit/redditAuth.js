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

//TODO need to improve, what if not authenticated yet...
exports.isLoggedIn = function(generatedState, callback) {

	if (!generatedState)
		return false;

	if (accounts[generatedState]) {
		console.log("[GET USER INSTANCE] account found.");
        callback(true);
    }

	else {

		console.log("[GET USER INSTANCE] account not found, retrieving account from db.");

		RedditUser.findOne({generatedState: generatedState}, function(err, data){

			if (err) throw new error(err);

			if (data) {
				console.log("[GET USER INSTANCE] account retrieved, refreshing...");
				//new reddit account and refresh
				accounts[generatedState] = new Snoocore(config.userConfig);
    			accounts[generatedState].refresh(data.refreshToken).then(function(){
					console.log("[GET USER INSTANCE] account refreshed.");
					callback(true);
    			});
    		} else {
				console.log("Account not found in db.");
				callback(false);
			}

    	});

    }
};

function getUserInstance(generatedState, callback) {

	console.log("[GET USER INSTANCE]");



}
