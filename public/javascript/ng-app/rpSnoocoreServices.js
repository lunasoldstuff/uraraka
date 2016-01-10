'use strict';

var rpSnoocoreServices = angular.module('rpSnoocoreServices', []);

rpSnoocoreServices.factory('rpSnoocoreService', ['$window', '$location', 'rpServerRefreshTokenResourceService', 'rpUserRefreshTokenResource', 'rpAuthUtilService',
	function($window, $location, rpServerRefreshTokenResourceService, rpUserRefreshTokenResource, rpAuthUtilService) {
		var Snoocore = $window.Snoocore;
		var rpSnoocoreService = {};
		var redditServer;
		var redditUser;
		var refreshTimeout = 59 * 60 * 1000;

		rpSnoocoreService.redditRequest = function(method, uri, params, callback) {
			console.log('[rpSnoocoreService] new redditRequest, method: ' + method +
				', uri: ' + uri + ', params: ' + JSON.stringify(params));

			getInstance(function(reddit) {

				console.log('[rpSnoocoreService] got reddit instance about to attempt, ' + uri);

				reddit(uri)[method](params).then(function(data) {
					// console.log('[rpSnoocoreService] data: ' + JSON.stringify(data));
					console.log('[rpSnoocoreService] redditRequest returned, method: ' + method +
						', uri: ' + uri + ', params: ' + JSON.stringify(params));
					callback(data);
				});

				// .catch(function(responseError) {
				// 	console.log('[rpSnoocoreService] responseError: ' + JSON.stringify(responseError));
				// 	responseError.responseError = true;
				// 	callback(responseError);
				// });

			});

		};

		var activeRequestCallbacks = [];
		var retrievingRefreshToken = false;

		function getInstance(callback) {

			if (rpAuthUtilService.isAuthenticated) {
				if (redditUser !== undefined && redditUser !== null) {
					console.log('[rpSnoocoreService] getInstance() returning user Snoocore');
					callback(redditUser);

				} else {
					console.log('[rpSnoocoreService] getInstance() no Snoocore obj, must get refresh token, adding callback to queue');

					activeRequestCallbacks.push(callback);

					if (!retrievingRefreshToken) {

						retrievingRefreshToken = true;

						rpUserRefreshTokenResource.get({}, function(data) {
							console.log('[rpSnoocoreService] user refresh token: ' + JSON.stringify(data));
							// redditServer = null;
							redditUser = new Snoocore(getConfig('user'));
							redditUser.refresh(data.refreshToken).then(function() {

								setTimeout(function() {
									console.log('USER ACCOUNT TIMEOUT');
									refreshAccessToken(redditUser, data.refreshToken);
								}, refreshTimeout);

								retrievingRefreshToken = false;

								console.log('[rpSnoocoreService] getInstance() calling all callbacks in queue');
								for (var i = 0; i < activeRequestCallbacks.length; i++) {
									console.log('[rpSnoocoreService] getInstance() calling callback ' + i);

									activeRequestCallbacks[i](redditUser);
								}

								activeRequestCallbacks = [];

							});
						});
					}

				}

			} else {
				if (redditServer !== undefined && redditServer !== null) {
					console.log('[rpSnoocoreService] getInstance() returning server Snoocore');
					callback(redditServer);

				} else {

					activeRequestCallbacks.push(callback);

					if (!retrievingRefreshToken) {
						retrievingRefreshToken = true;

						//get refresh token from the server to create generic Snoocore obj.
						console.log('[rpSnoocoreService] attempt getting server refresh token... ');

						rpServerRefreshTokenResourceService.get({}, function(data) {
							console.log('[rpSnoocoreService] server refresh token: ' + data.refreshToken);

							// redditUser = null;
							redditServer = new Snoocore(getConfig('server'));
							redditServer.refresh(data.refreshToken).then(function() {

								setTimeout(function() {
									console.log('SERVER ACCOUNT TIMEOUT');
									refreshAccessToken(redditServer, data.refreshToken);
								}, refreshTimeout);

								retrievingRefreshToken = false;

								for (var i = 0; i < activeRequestCallbacks.length; i++) {
									activeRequestCallbacks[i](redditServer);
								}

								activeRequestCallbacks = [];

							});
						});
					}
				}
			}
		}

		function refreshAccessToken(reddit, refreshToken) {
			console.log('[rpSnoocoreService] refreshAccessToken.');

			reddit.refresh(refreshToken).then(function() {
				setTimeout(function() {
					refreshAccessToken(reddit, refreshToken);
				}, refreshTimeout);
			});

		}

		function getConfig(type) {
			var localRe = /(localhost)/;

			console.log('[rpSnoocoreService] getConfig, type: ' + type);
			console.log('[rpSnoocoreService] getConfig, $location.absUrl(): ' + $location.absUrl());
			console.log('[rpSnoocoreService] getConfig, localRe.test($location.absUrl): ' + localRe.test($location.absUrl()));


			if (localRe.test($location.absUrl())) {
				return development[type];
			} else {
				return demo[type];
			}
		}

		var demo = {

			"server": {
				"userAgent": "paper for reddit: reddit material design",
				"oauth": {
					"type": "explicit",
					"duration": "permanent",
					"key": "53H3FVKcY8_gmQ",
					"secret": "vX4RLQy4Sr7Z4Reia0Z3cDzE3PU",
					"redirectUri": "http://www.reddup.co/auth/reddit/appcallback",
					"scope": [
						"identity",
						"edit",
						"flair",
						"history",
						"mysubreddits",
						"privatemessages",
						"read",
						"report",
						"save",
						"submit",
						"subscribe",
						"vote",
						"creddits"
					]
				}
			},

			"user": {
				"userAgent": "paper for reddit: reddit material design",
				"oauth": {
					"type": "explicit",
					"duration": "permanent",
					"key": "mxKozRXrp3xAIg",
					"secret": "wYJ0AUzbKUjgMbVlzXO5KzHzpVo",
					"redirectUri": "http://www.reddup.co/auth/reddit/callback",
					"scope": [
						"identity",
						"edit",
						"flair",
						"history",
						"mysubreddits",
						"privatemessages",
						"read",
						"report",
						"save",
						"submit",
						"subscribe",
						"vote",
						"creddits"
					]
				}
			}

		};

		var development = {

			"server": {
				"userAgent": "paper for reddit: reddit material design",
				"oauth": {
					"type": "explicit",
					"duration": "permanent",
					"key": "uo6XXqf-WF43Wg",
					"secret": "_cgKzeyu52HPSMrCFcxkXdPXS04",
					"redirectUri": "http://localhost:3000/auth/reddit/appcallback",
					"scope": [
						"identity",
						"edit",
						"flair",
						"history",
						"mysubreddits",
						"privatemessages",
						"read",
						"report",
						"save",
						"submit",
						"subscribe",
						"vote",
						"creddits"
					]
				}
			},
			"user": {
				"userAgent": "paper for reddit: reddit material design",
				"oauth": {
					"type": "explicit",
					"duration": "permanent",
					"key": "Gpy69vUdPU_-MA",
					"secret": "zlcuxzzwfexoVKpYatn_1lfZslI",
					"redirectUri": "http://localhost:3000/auth/reddit/callback",
					"scope": [
						"identity",
						"edit",
						"flair",
						"history",
						"mysubreddits",
						"privatemessages",
						"read",
						"report",
						"save",
						"submit",
						"subscribe",
						"vote",
						"creddits"
					]
				}
			}

		};

		return rpSnoocoreService;

	}
]);