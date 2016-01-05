'use strict';

var rpSnoocoreServices = angular.module('rpSnoocoreServices', []);

rpSnoocoreServices.factory('rpSnoocoreService', ['$window', 'rpServerRefreshTokenResourceService', 'rpAuthUtilService',
	function($window, rpServerRefreshTokenResourceService, rpAuthUtilService) {
		var Snoocore = $window.Snoocore;
		var when = $window.when;
		var rpSnoocoreService = {};
		var reddit;

		rpSnoocoreService.redditRequest = function(method, uri, params, callback) {
			console.log('[rpSnoocoreService] redditRequest, method: ' + method +
				', uri: ' + uri + ', params: ' + JSON.stringify(params));

			getSnoocoreObject(function(reddit) {
				reddit(uri)[method](params).then(function(data) {
					console.log('[rpSnoocoreService] data: ' + JSON.stringify(data));
					callback(data);
				}).catch(function(responseError) {
					responseError.err = true;
					callback(responseError);
				});
			});

		};

		function getSnoocoreObject(callback) {
			if (reddit !== undefined) {
				callback(reddit);

			} else {

				if (rpAuthUtilService.isAuthenticated) {
					//create a user Snoocore object.

				} else {
					//get refresh token from the server to create generic Snoocore obj.
					console.log('[rpSnoocoreService] attempt getting server refresh token... ');

					rpServerRefreshTokenResourceService.get({}, function(data) {
						console.log('[rpSnoocoreService] server refresh token: ' + data.refreshToken);

						reddit = new Snoocore(serverConfig);
						reddit.refresh(data.refreshToken).then(function() {
							callback(reddit);

						});
					});
				}
			}
		}

		var serverConfig = {
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
		};

		return rpSnoocoreService;

	}
]);