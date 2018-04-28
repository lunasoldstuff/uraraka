'use strict';

(function () {
		'use strict';

		angular.module('rpApp').factory('rpAppAuthService', ['$rootScope', 'rpSettingsService', rpAppAuthService]);

		function rpAppAuthService($rootScope, rpSettingsService) {

				console.log('[rpAppAuthService] load');

				var rpAppAuthService = {};

				rpAppAuthService.isAuthenticated = false;

				// rpAppAuthService.identity = {};

				rpAppAuthService.setIdentity = function (identity) {
						rpAppAuthService.identity = identity;
				};

				rpAppAuthService.setAuthenticated = function (authenticated) {
						console.log('[rpAppAuthService] setAuthenticated: ' + authenticated);
						rpAppAuthService.isAuthenticated = authenticated === 'true';

						$rootScope.$emit('authenticated');
				};

				return rpAppAuthService;
		}
})();