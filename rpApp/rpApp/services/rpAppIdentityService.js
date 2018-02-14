(function() {
	'use strict';

	angular.module('rpApp').factory('rpAppIdentityService', [
		'rpAppAuthService',
		'rpAppRedditApiService',
		rpAppIdentityService
	]);

	function rpAppIdentityService(rpAppAuthService, rpAppRedditApiService) {

		var rpAppIdentityService = {};
		var callbacks = [];
		var gettingIdentity = false;

		rpAppIdentityService.identity = null;

		rpAppIdentityService.reloadIdentity = function(callback) {
			rpAppIdentityService.identity = null;
			rpAppIdentityService.getIdentity(callback);

		};

		rpAppIdentityService.getIdentity = function(callback) {
			console.log('[rpAppIdentityService] getIdentity()');

			if (rpAppAuthService.isAuthenticated) {

				if (rpAppIdentityService.identity !== null) {
					console.log('[rpAppIdentityService] getIdentity(), have identity');
					callback(rpAppIdentityService.identity);

				} else {

					callbacks.push(callback);

					if (gettingIdentity === false) {
						gettingIdentity = true;

						console.log('[rpAppIdentityService] getIdentity(), requesting identity');

						rpAppRedditApiService.redditRequest('get', '/api/v1/me', {

						}, function(data) {
							rpAppIdentityService.identity = data;
							gettingIdentity = false;

							for (var i = 0; i < callbacks.length; i++) {
								callbacks[i](rpAppIdentityService.identity);
							}

							callbacks = [];

						});

					}

				}

			} else {
				callback(null);
			}
		};

		return rpAppIdentityService;
	}

})();