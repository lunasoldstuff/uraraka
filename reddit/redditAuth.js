var Snoocore = require('snoocore');
var when = require('when');
var open = require('open');
var config = require('./config.json');
var RedditUser = require('../models/redditUser.js');
var crypto = require('crypto');
// var RedditAccounts = require('../models/redditAccounts.js');

var accounts = {};

// function refreshUser() {
// 	RedditUser.findOne({generatedState})
// }

// restoreAccounts();

exports.newInstance = function(generatedState) {
	var reddit = new Snoocore(config.userConfig);
	accounts[generatedState] = reddit;
	
	setTimeout(function() {
      delete accounts[generatedState];
    }, 59 * 60 * 60 * 1000);

	// presistAccounts();

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
	        		console.log('create new RedditUser, generatedState: ' + generatedState + ", refreshToken: " + refreshToken);
	        		newRedditUser.generatedState = generatedState;
	        		newRedditUser.refreshToken = refreshToken;
	        		newRedditUser.save(function(err){
	        			if (err) throw new error(err);
	        			callback();
	        		});
	        	}
	        });
	        // presistAccounts();
	    });
	} else {
	    console.log("Error states do not match...");
	    console.error('generatedState:', generatedState);
	    console.error('returnedState:', returnedState);
	}
};

exports.getInstance = function(generatedState) {
	return getUserInstance(generatedState);
};

exports.removeInstance = function(generatedState) {
	accounts[generatedState].deauth();
	delete accounts[generatedState];
	// presistAccounts();
};

//TODO need to improve, what if not authenticated yet...
exports.isLoggedIn = function(generatedState) {
	if (!generatedState)
		return false;
	if(getUserInstance(generatedState))
		return true;
	return false;
};

function getUserInstance(generatedState) {
	if (accounts[generatedState]) {
        return when.resolve(accounts[generatedState]);
    } else {
    	console.log("generatedState: " + generatedState);
    	RedditUser.findOne({generatedState: generatedState}, function(err, data){
    		if (err) throw new error(err);
    		else if (data) {
    			//new reddit account and refresh
    			console.log(JSON.stringify(data));
    			accounts[generatedState] = new Snoocore(config.userConfig);
    			accounts[generatedState].refresh(data.refreshToken).then(function(){
    				return when.resolve(accounts[generatedState]);
    			});
    		}
    	});
    	// presistAccounts();
    }
    console.log('getUserInstance: returning null');
    return null;
}

// function restoreAccounts() {
// 	RedditAccounts.findOne({}, function(err, data) {
// 		if (err) throw new error(err);
// 		if (data) {
// 			console.log(data);
// 			accounts = data.accounts;
// 		} else {
// 			newAccounts = new RedditAccounts();
// 			newAccounts.accounts = accounts;
// 			newAccounts.save(function(err){
// 				if (err) throw new error(err);
// 			});
// 		}
// 	});
// }

// function presistAccounts() {
// 	RedditAccounts.findOne({}, function(err, data){
// 		if (err) throw new error(err);
// 		if (data) {
// 			data.accounts = accounts;
// 			data.save(function(err) {
// 				if (err) throw new error(err);
// 			});
// 		}
// 	});
// }