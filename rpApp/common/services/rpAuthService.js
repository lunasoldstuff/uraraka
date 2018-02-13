(function() {
	'use strict';

	angular.module('rpApp').factory('rpAuthService', [
		'$rootScope',
		'rpSettingsService',
		rpAuthService
	]);

	function rpAuthService($rootScope, rpSettingsService) {

		console.log('[rpAuthService] load');

		var rpAuthService = {};

		rpAuthService.isAuthenticated = false;

		// rpAuthService.identity = {};

		rpAuthService.setIdentity = function(identity) {
			rpAuthService.identity = identity;
		};

		rpAuthService.setAuthenticated = function(authenticated) {
			console.log('[rpAuthService] setAuthenticated: ' + authenticated);
			rpAuthService.isAuthenticated = authenticated === 'true';

			$rootScope.$emit('authenticated');

		};

		return rpAuthService;

	}
})();