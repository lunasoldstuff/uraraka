(function() {
	'use strict';

	angular.module('rpApp').factory('rpAppAuthService', [
		'$rootScope',
		'rpAppSettingsService',
		rpAppAuthService
	]);

	function rpAppAuthService($rootScope, rpAppSettingsService) {

		console.log('[rpAppAuthService] load');

		var rpAppAuthService = {};

		rpAppAuthService.isAuthenticated = false;

		// rpAppAuthService.identity = {};

		rpAppAuthService.setIdentity = function(identity) {
			rpAppAuthService.identity = identity;
		};

		rpAppAuthService.setAuthenticated = function(authenticated) {
			console.log('[rpAppAuthService] setAuthenticated: ' + authenticated);
			rpAppAuthService.isAuthenticated = authenticated === 'true';

			$rootScope.$emit('authenticated');

		};

		return rpAppAuthService;

	}
})();