var Snoocore = require('snoocore');
var when = require('when');
var open = require('open');
var RedditUser = require('../../models/redditUser');
var RedditRefreshToken = require('../../models/redditRefreshToken');
var config = require('../common.js').config();
var redditApiHandler = require('./redditApiHandler');
var crypto = require('crypto');
var winston = require('winston');

var accounts = {};
//refresh the access token every 59 minutes.
var REFRESH_TIMEOUT = 59 * 60 * 1000;
var ACCOUNT_TIMEOUT = 13 * 24 * 60 * 60 * 1000;

exports.newInstance = function(generatedState) {
	var reddit = new Snoocore(config);

	// accounts[generatedState] = reddit;
	return reddit.getExplicitAuthUrl(generatedState);
};

exports.completeAuth = function(session, returnedState, code, error, callback) {
	var generatedState = session.generatedState;

	//console.log("[redditAuthHandler completeAuth] generatedState: " + generatedState + ", returnedState: " + returnedState);

	/*
		Check states match.
	 */
	// if (returnedState === generatedState && returnedState in accounts) {
	if (returnedState === generatedState) {

		var reddit = new Snoocore(config);
		accounts[generatedState] = reddit;

		accounts[generatedState].auth(code).then(function(refreshToken) {

			//console.log("[redditAuthHandler] completeAuth(), refresh token: " + refreshToken);

			/*
				set timeout to refresh the account every 59 minutes.
			 */
			setTimeout(function() {
				//console.log('ACCOUNT TIMEOUT');
				refreshAccessToken(generatedState, refreshToken, null);
			}, REFRESH_TIMEOUT);

			setTimeout(function() {
				//console.log('ACCOUNT DELETE');
				if (accounts[generatedState])
					delete accounts[generatedState];
			}, ACCOUNT_TIMEOUT);

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

				//console.log('[redditAuthHandler] /api/v1/me, data: ' + JSON.stringify(data));

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

					/*
					This is a new user,
					Create a record and store user inforamtion
					and refreshToken:generatedState pair.
					*/
					if (!returnedUser) {
						//console.log('[redditAuthHandler completeAuth] saving new user, data.name: ' + data.name);

						var newRedditUser = new RedditUser();

						//TODO could use object destructuring here.
						newRedditUser.id = data.id;
						newRedditUser.name = data.name;

						newRedditUser.save(function(err) {
							if (err) throw new error(err);
							//Subscribe the new user the r/reddupco
							accounts[generatedState]('/api/subscribe').post({
								action: 'sub',
								sr: 't5_3cawe'
							}).then(function(data) {

							}).catch(function(responseError) {
								if (err) throw new error(responseError);

							});
						});

					}

					//create and save the new refreshToken.
					var newRefreshToken = new RedditRefreshToken();

					newRefreshToken.userId = data.id;
					newRefreshToken.createdAt = Date.now();
					newRefreshToken.generatedState = generatedState;
					newRefreshToken.refreshToken = refreshToken;

					newRefreshToken.save(function(err) {
						if (err) throw new error(err);
						callback();
					});

				});

			}).catch(function(responseError) {
				throw responseError;
			});

		});

	} else {
		winston.log('error', 'generatedState:', generatedState);
		winston.log('error', 'returnedState:', returnedState);

		throw new Error("Something went wrong trying to log you in. Please try again.");
	}
};

exports.getRefreshToken = function(req, res, next, callback) {
	// console.log('[auth /usertoken] getRefreshToken(), req.session.userId: ' + req.session.userId);
	RedditRefreshToken.findOne({
		userId: req.session.userId,
		generatedState: req.session.generatedState
	}, function(err, data) {
		if (err) next(err);
		if (data) {
			// console.log('[auth /usertoken] getRefreshToken(), refresh token found, data.refreshToken: ' + data.refreshToken);
			if (data.refreshToken !== undefined) {
				callback(data.refreshToken);
			} else {
				// console.log('[auth /usertoken] getRefreshToken(), refresh token not found');
				next(new Error());
			}

		}
	});
};

/*
	Might have to update the createdAt date when the account is accessed
	through just the in memory object as well.
 */
exports.getInstance = function(req, res, next, callback) {
	// console.log('[redditAuthHandler] getInstance() generatedState: ' + req.session.generatedState + ', req.session.userId: ' + req.session.userId);

	if (accounts[req.session.generatedState]) {
		// console.log('[redditAuthHandler] getInstance() Returning reddit object from accounts[]');
		when.resolve(accounts[req.session.generatedState]).then(function(reddit) {
			callback(reddit);
		}).catch(function(error) {
			next(error);
		});

	} else {

		// console.log('[redditAuthHandler] getInstance() search db for refresh token...');

		RedditRefreshToken.findOne({
			userId: req.session.userId,
			generatedState: req.session.generatedState
		}, function(err, data) {
			if (err) next(err);
			if (data) {
				// console.log('[redditAuthHandler] getInstance() refresh token found, data.refreshToken: ' + data.refreshToken);
				//update created at date on refreshToken
				data.createdAt = Date.now();

				data.save(function(err) {
					if (err) next(err);
					//console.log('[redditAuthHandler] getInstance() REFRESH TOKEN CREATED AT UPDATED...');
				});

				//new reddit account and refresh
				accounts[req.session.generatedState] = new Snoocore(config);

				setTimeout(function() {
					//console.log('ACCOUNT TIMEOUT');
					if (accounts[req.session.generatedState])
						delete accounts[req.session.generatedState];
				}, ACCOUNT_TIMEOUT);

				refreshAccessToken(data.generatedState, data.refreshToken, function(err) {
					if (err) throw err;
					//console.log('[redditAuthHandler] getInstance() SNOOCORE OBJ REFRESHED...');
					when.resolve(accounts[req.session.generatedState]).then(function(reddit) {
						callback(reddit);
					});
				});
			} else {
				// console.log('[redditAuthHandler] getInstance() no refresh token found');
				callback(false);
			}
		});

	}
};

//TODO should not need to do this, snoocore will handle it automatically.
function refreshAccessToken(generatedState, refreshToken, callback) {

	//console.log('[redditAuthHandler] refreshAccessToken');

	if (accounts[generatedState]) {
		accounts[generatedState].refresh(refreshToken).then(function() {
			//console.log('ACCOUNT REFRESHED');

			setTimeout(function() {
				//console.log('ACCOUNT TIMEOUT');
				refreshAccessToken(generatedState, refreshToken);
			}, REFRESH_TIMEOUT);

			if (callback) callback();

		}).catch(function(err) {
			if (callback) callback(err);
		});
	} else {
		if (callback) callback(new Error("error refreshing reddit account. account not found."));
	}

}

exports.logOut = function(req, res, next, callback) {

	/*
		deauthorize and remove
		reddit snoocore object
		fom the accounts store.
	 */

	if (accounts[req.session.generatedState]) {
		//console.log('found account, removing');
		accounts[req.session.generatedState].deauth();
		delete accounts[req.session.generatedState];
	}

	/*
		Remove refreshToken from database.
	*/
	RedditRefreshToken.findOneAndRemove({
		userId: req.session.userId,
		generatedState: req.session.generatedState
	}, function(err, doc, result) {
		if (err) {
			// console.log('[logout] err')
			next(err);

		}
		callback();
	});


};