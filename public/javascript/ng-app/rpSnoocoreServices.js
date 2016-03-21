'use strict';

var rpSnoocoreServices = angular.module('rpSnoocoreServices', []);

rpSnoocoreServices.factory('rpSnoocoreService', ['$window', 'rpServerRefreshTokenResourceService', 'rpUserRefreshTokenResourceService', 'rpAuthUtilService',
	function($window, rpServerRefreshTokenResourceService, rpUserRefreshTokenResourceService, rpAuthUtilService) {
		var Snoocore = $window.Snoocore;
		var when = $window.when;
		var rpSnoocoreService = {};
		var redditServer;
		var redditUser;
		var refreshTimeout = 59 * 60 * 1000;

		rpSnoocoreService.redditRequest = function(method, uri, params, callback) {
			console.log('[rpSnoocoreService] redditRequest, method: ' + method +
				', uri: ' + uri + ', params: ' + JSON.stringify(params));

			getInstance(function(reddit) {
				reddit(uri)[method](params).then(function(data) {
					// console.log('[rpSnoocoreService] data: ' + JSON.stringify(data));
					console.log('[rpSnoocoreService] redditRequest, method: ' + method +
						', uri: ' + uri + ', params: ' + JSON.stringify(params));
					callback(data);
				})

				.catch(function(responseError) {
					console.log('[rpSnoocoreService] responseError: ' + JSON.stringify(responseError));
					responseError.responseError = true;
					callback(responseError);
				});
			});

		};

		function getInstance(callback) {
			console.log('[rpSnoocoreService] getInstance');
			if (rpAuthUtilService.isAuthenticated) {
				if (redditUser !== undefined) {
					callback(redditUser);
				} else {
					console.log('[rpSnoocoreService] attempt to get user refresh token... ');

					rpUserRefreshTokenResourceService.get({}, function(data) {
						console.log('[rpSnoocoreService] getUserRefreshToken, data: ' + JSON.stringify(data));
						redditUser = new Snoocore(userConfig[data.env]);
						redditUser.refresh(data.refreshToken).then(function() {
							callback(redditUser);

						}).catch(function(responseError) {
							console.log('[rpSnoocoreService] error refreshing reddit obj, error: ' + responseError);
							responseError.responseError = true;
							callback(responseError);
						});

						setTimeout(function() {
							console.log('ACCOUNT TIMEOUT');
							refreshAccessToken(redditUser, data.refreshToken).then(function() {

							}).catch(function(responseError) {
								responseError.responseError = true;
								callback(responseError);
							});
						}, refreshTimeout);

					});
				}
			} else {
				if (redditServer !== undefined) {
					callback(redditServer);

				} else {

					//get refresh token from the server to create generic Snoocore obj.
					console.log('[rpSnoocoreService] attempt getting server refresh token... ');

					rpServerRefreshTokenResourceService.get({}, function(data) {
						console.log('[rpSnoocoreService] getServerRefreshToken, data: ' + JSON.stringify(data));

						redditServer = new Snoocore(serverConfig[data.env]);
						redditServer.refresh(data.refreshToken).then(function() {
							callback(redditServer);

						});

						setTimeout(function() {
							console.log('ACCOUNT TIMEOUT');
							refreshAccessToken(redditServer, data.refreshToken);
						}, refreshTimeout);

					});
				}
			}
		}

		function refreshAccessToken(reddit, refreshToken) {
			console.log('[rpSnoocoreService] refreshAccessToken.');
			reddit.refresh(refreshToken).then(function() {
				refreshAccessToken(reddit, refreshToken);
			}, refreshTimeout);

		}

		var userConfig = {

			development: {
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
			},

			demo: {
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



		var serverConfig = {
			development: {
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
			demo: {
				"userAgent": "paper for reddit: reddit material design",
				"oauth": {
					"type": "explicit",
					"duration": "permanent",
					"key": "uo6XXqf-WF43Wg",
					"secret": "_cgKzeyu52HPSMrCFcxkXdPXS04",
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
			}
		};


		return rpSnoocoreService;

	}
]);