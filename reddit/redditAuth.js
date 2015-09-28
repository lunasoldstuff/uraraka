var Snoocore = require('snoocore');
var when = require('when');
var open = require('open');
// var config = require('./config.json');
var config = require('../common.js').config();
var RedditUser = require('../models/redditUser');
var redditApiHandler = require('./redditApiHandler');
var crypto = require('crypto');

var accounts = {};
//refresh the access token every 59 minutes.
var accountTimeout = 59 * 60 * 1000;

exports.newInstance = function(generatedState) {
	var reddit = new Snoocore(config.userConfig);

	accounts[generatedState] = reddit;
	return reddit.getExplicitAuthUrl(generatedState);
};

exports.completeAuth = function(session, returnedState, code, error, callback) {
	var generatedState = session.generatedState;

	console.log("[redditAuth completeAuth] generatedState: " + generatedState + ", returnedState: " + returnedState);

	/*
		Check states match.
	 */
	if (returnedState === generatedState && accounts[returnedState]) {

		accounts[generatedState].auth(code).then(function(refreshToken) {
			console.log("[redditAuth] completeAuth(), refresh token: " + refreshToken);

			setTimeout(function() {
				console.log('ACCOUNT TIMEOUT');
				refreshAccessToken(generatedState, refreshToken);
			}, accountTimeout);

			/*
				Get user information.
			 */
			redditApiHandler.me(generatedState, function(err, data) {

				if (err) {
					throw new Error(err);
					
				} else {
					
					/*
						Add the user id to the session.
						Used for verifying authentication and
						retrieving settings.
					 */
					session.userId = data.id;

					session.save(function(err) {
						if (err) throw new Error(err);
					});

					/*
						Search database by user id to see if they've logged in before.
					 */
					RedditUser.findOne({id: data.id}, function(err, data) {
						if (err) throw new Error(err);

						if (data) {

							/*
								User has logged in before, 
								Add the new refreshToken:generatedState pair to
								the database.
							 */
							
							console.log('[redditAuth completeAuth] found user updating record, data.name: ' + data.name);
							
							data.refreshTokens.push({
								createdAt: Date.now(),
								generatedState: generatedState,
								refreshToken: refreshToken
							});

							data.save(function(err) {
								if (err) throw new error(err);
								callback();
							});

						}

						else {
							
							/*
								This is a new user, 
								Create a record and store user inforamtion
								and refreshToken:generatedState pair.
							 */
							
							 console.log('[redditAuth completeAuth] saving new user, data.name: ' + data.name);

							var newRedditUser = new RedditUser();

							newRedditUser.id = data.id;
							newRedditUser.name = data.name;

							newRedditUser.refreshTokens.push({
								createdAt: Date.now(),
								generatedState: generatedState,
								refreshToken: refreshToken
							});

							newRedditUser.save(function(err){
								if (err) throw new error(err);
								callback();
							});
							
						}

					});
					
				}


			});

		});

	} else {
		console.log("Error states do not match...");
		console.error('generatedState:', generatedState);
		console.error('returnedState:', returnedState);
		throw new Error("authorization states did not match.");
	}
};

/*
	Might have to update the createdAt date when the account is accessed
	through just the in memory object as well.
 */
exports.getInstance = function(generatedState, id) {
	if (accounts[generatedState]) {
		return when.resolve(accounts[generatedState]);

	} else {

		RedditUser.findOne({'id': id, 'refreshTokens.generatedState': generatedState}, function(err, data){
			if (err) throw new error(err);
			else {

				var refreshToken;

				for (var i = 0; i < data.refreshTokens; i++) {
					if (generatedState === data.refreshTokens[i].generatedState) {
						refreshToken = data.refreshToken[i];
						break;
					}
				}

				if (refreshToken) {
					//update created at date on refreshToken
					refreshToken.createdAt = Date.now();
					data.save(function(err) {
						if (err) throw new Error(err);
					});

					//new reddit account and refresh
					accounts[generatedState] = new Snoocore(config.userConfig);
					
					refreshAccessToken(refreshToken.generatedState, refreshToken.refreshToken, function() {
						return when.resolve(accounts[generatedState]);
					});				
					
				}
				
			}
		});
	}
};

exports.logOut = function(generatedState) {
	
	/*
		Remove reddit snoocore object fom the accounts
		object.
	 */

	if (accounts[generatedState]) {
		console.log('found account, removing');
		accounts[generatedState].deauth();
		delete accounts[generatedState];
	}

	/* 
		Remove refreshToken:generatedState pair from database.
	*/

	RedditUser.findOne({'id': id, 'refreshTokens.generatedState': generatedState}, function(err, data){
		if (err) throw new error(err);
		else {
			var i = 0;
			var refreshToken;

			for (; i < data.refreshTokens; i++) {
				if (generatedState === data.refreshTokens[i].generatedState) {
					refreshToken = data.refreshTokens[i];
					break;

				}
			}

			if (refreshToken) {
				var refreshTokens = data.refreshTokens;
				refreshTokens.splice(i, 1);
				data.refreshTokens = refreshTokens;
				data.save(function(err){
					if (err) throw new Error(err);
				});
			}
		}
	});

};

function refreshAccessToken(generatedState, refreshToken) {
	
	if (accounts[generatedState]) {
		accounts[generatedState].refresh(refreshToken).then(function(){
			console.log('ACCOUNT REFRESHED');
			
			setTimeout(function() {
				console.log('ACCOUNT TIMEOUT');
				refreshAccessToken(generatedState, refreshToken);
			}, accountTimeout);
			

		});		
	}
}

exports.testMongo = function(req, callback) {

	console.log('[TEST MONGO]');

	var newRedditUser = new RedditUser();

	newRedditUser.id = "userId";
	newRedditUser.name = "userName";
	
	newRedditUser.refreshTokens.push({
		createdAt: Date.now(),
		generatedState: "generatedState1",
		refreshToken: "refreshToken1"
	});
	
	newRedditUser.refreshTokens.push({
		createdAt: Date.now(),
		generatedState: "generatedState2",
		refreshToken: "refreshToken2"
	});

	newRedditUser.save(function(err){
		if (err) throw new error(err);
		
		RedditUser.findOne({'refreshTokens.generatedState': 'generatedState1', 'id': 'userId'}, function(err, data) {

			console.log('[TEST MONGO] data: ' + data);

			console.log('[TEST MONGO] data.refreshTokens: ' + data.refreshTokens);

			var refreshToken;
			var i = 0;

			for (; i < data.refreshTokens.length; i++) {
				if ("generatedState2" === data.refreshTokens[i].generatedState) {
					refreshToken = data.refreshTokens[i];
					break;
				}
			}

			// console.log('test edit');
			// if (refreshToken) {
			// 	console.log('refreshToken.createdAt: ' + refreshToken.createdAt);

			// 	refreshToken.createdAt = Date.now();

			// 	console.log('refreshToken.createdAt: ' + refreshToken.createdAt);

			// 	refreshToken.generatedState = "editted generated state";

			// 	data.save(function(err) {
			// 		if (err) throw new Error();
			// 	});

			// 	console.log('[TEST MONGO] refreshToken: ' + refreshToken);
			// }

			console.log('test removal');

			if (refreshToken) {
				console.log('removing item: ' + data.refreshTokens[i]);
				var refreshTokens = data.refreshTokens;
				refreshTokens.splice(i, 1);
				data.refreshTokens = refreshTokens;
				data.save(function(err) {
					if (err) throw new Error(err);
				});
			}

			callback();

		});
	});

};