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
var refreshTimeout = 59 * 60 * 1000;
var accountTimeout = 13 * 24 * 60 * 60 * 1000;

exports.newInstance = function(generatedState) {
	var reddit = new Snoocore(config.userConfig);

	accounts[generatedState] = reddit;
	return reddit.getExplicitAuthUrl(generatedState);
};

exports.completeAuth = function(session, returnedState, code, error, callback) {
	var generatedState = session.generatedState;

	console.log("[redditAuthHandler completeAuth] generatedState: " + generatedState + ", returnedState: " + returnedState);

	/*
		Check states match.
	 */
	if (returnedState === generatedState && accounts[returnedState]) {

		accounts[generatedState].auth(code).then(function(refreshToken) {
			console.log("[redditAuthHandler] completeAuth(), refresh token: " + refreshToken);

			/*
				set timeout to refresh the account every 59 minutes.
			 */
			setTimeout(function() {
				console.log('ACCOUNT TIMEOUT');
				refreshAccessToken(generatedState, refreshToken, null);
			}, refreshTimeout);

			setTimeout(function() {
				console.log('ACCOUNT DELETE');
				if (accounts[generatedState])
					delete accounts[generatedState];
			}, accountTimeout);

			/*
				Get user information.
				(userId)
			 */

			accounts[generatedState]('/api/v1/me').get().then(function(data) {

				/*
					Add the user id to the session.
					Used for verifying authentication and
					retrieving settings.
				 */

				console.log('[redditAuthHandler] /api/v1/me, data: ' + JSON.stringify(data));

				session.userId = data.id;

				session.save(function(err) {
					if (err) throw new Error(err);
				});

				/*
					Search database by user id to see if they've logged in before.
				 */
				RedditUser.findOne({
					id: data.id
				}, function(err, returnedUser) {
					if (err) throw new Error(err);

					if (returnedUser) {

						/*
							User has logged in before,
							Add the new refreshToken:generatedState pair to
							the database.
						 */
						console.log('[redditAuthHandler completeAuth] found user updating record, data.name: ' + returnedUser.name);

						returnedUser.refreshTokens.push({
							createdAt: Date.now(),
							generatedState: generatedState,
							refreshToken: refreshToken
						});

						returnedUser.save(function(err) {
							if (err) throw new error(err);
							callback();
						});

					} else {

						/*
							This is a new user,
							Create a record and store user inforamtion
							and refreshToken:generatedState pair.
						 */

						console.log('[redditAuthHandler completeAuth] saving new user, data.name: ' + data.name);

						var newRedditUser = new RedditUser();

						newRedditUser.id = data.id;
						newRedditUser.name = data.name;

						newRedditUser.refreshTokens.push({
							createdAt: Date.now(),
							generatedState: generatedState,
							refreshToken: refreshToken
						});

						newRedditUser.save(function(err) {
							if (err) throw new error(err);
							callback();
						});

					}

				});

			}).catch(function(responseError) {
				throw reposeError;
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
exports.getInstance = function(generatedState, id, callback) {
	console.log('[redditAuth] getInstance() generatedState: ' + generatedState + ', id: ' + id);

	if (accounts[generatedState]) {
		console.log('[redditAuth] getInstance() RETURNING REDDIT OBJECT FROM ACCOUNTS{}...');
		when.resolve(accounts[generatedState]).then(function(reddit) {
			callback(reddit);
		});

	} else {

		console.log('[redditAuth] getInstance() search db for refresh token...');

		RedditUser.findOne({
			'id': id,
			'refreshTokens.generatedState': generatedState

		}, function(err, data) {
			if (err) {
				console.log('[redditAuth] getInstance() ERROR RETRIEVING USER DATA FROM DATABASE...');
				throw new error(err);
			}

			if (data) {
				console.log('[redditAuth] getInstance() USER FOUND IN DATABASE...');

				var refreshToken;

				for (var i = 0; i < data.refreshTokens.length; i++) {
					if (generatedState === data.refreshTokens[i].generatedState) {
						refreshToken = data.refreshTokens[i];
						break;
					}
				}

				if (refreshToken) {

					console.log('[redditAuth] getInstance() REFRESH TOKEN FOUND...');

					//update created at date on refreshToken
					refreshToken.createdAt = Date.now();
					data.save(function(err) {
						if (err) throw new Error(err);
						console.log('[redditAuth] getInstance() REFRESH TOKEN CREATED AT UPDATED...');
					});

					//new reddit account and refresh
					accounts[generatedState] = new Snoocore(config.userConfig);

					setTimeout(function() {
						console.log('ACCOUNT TIMEOUT');
						if (accounts[generatedState])
							delete accounts[generatedState];
					}, accountTimeout);

					refreshAccessToken(refreshToken.generatedState, refreshToken.refreshToken, function(err) {
						if (err) throw err;
						console.log('[redditAuth] getInstance() SNOOCORE OBJ REFRESHED...');
						when.resolve(accounts[generatedState]).then(function(reddit) {
							callback(reddit);
						});
					});

				}

			}
		});

	}
};

function refreshAccessToken(generatedState, refreshToken, callback) {

	console.log('[redditAuthHandler] refreshAccessToken');

	if (accounts[generatedState]) {
		accounts[generatedState].refresh(refreshToken).then(function() {
			console.log('ACCOUNT REFRESHED');

			setTimeout(function() {
				console.log('ACCOUNT TIMEOUT');
				refreshAccessToken(generatedState, refreshToken);
			}, refreshTimeout);

			if (callback) callback();

		}).catch(function(err) {
			if (callback) callback(err);
		});
	} else {
		if (callback) callback(new Error("error refreshing reddit account. account not found."));
	}

}

exports.logOut = function(generatedState, id, callback) {

	/*
		deauthorize and remove
		reddit snoocore object
		fom the accounts store.
	 */

	if (accounts[generatedState]) {
		console.log('found account, removing');
		accounts[generatedState].deauth();
		delete accounts[generatedState];
	}

	/*
		Remove refreshToken:generatedState pair from database.
	*/

	console.log('[redditAuthHandler] logOut(), generatedState: ' + generatedState + ', id: ' + id);
	RedditUser.findOne({
		'id': id,
		'refreshTokens.generatedState': generatedState
	}, function(err, data) {
		if (err) throw new error(err);

		if (data) {

			var i = 0;
			var refreshToken;

			console.log('[redditAuthHandler] logOut(), data: ' + data);

			for (; i < data.refreshTokens.length; i++) {
				if (generatedState === data.refreshTokens[i].generatedState) {
					refreshToken = data.refreshTokens[i];
					break;

				}
			}

			if (refreshToken) {
				var refreshTokens = data.refreshTokens;
				refreshTokens.splice(i, 1);
				data.refreshTokens = refreshTokens;
				data.save(function(err) {
					if (err) throw new Error(err);
					callback();
				});
			}
		} else {
			callback();
		}
	});

};

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

	newRedditUser.save(function(err) {
		if (err) throw new error(err);

		RedditUser.findOne({
			'refreshTokens.generatedState': 'generatedState1',
			'id': 'userId'
		}, function(err, data) {

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