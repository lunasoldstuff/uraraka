(function() {
	'use strict';
	angular.module('rpApp').controller('rpAppIdentitySidenavCtrl', [
		'$scope',
		'$rootScope',
		'$timeout',
		'$mdDialog',
		'rpAppIdentityService',
		'rpAppSettingsService',
		'rpAppIsMobileViewService',
		'rpAppLocationService',
		rpAppIdentitySidenavCtrl
	]);

	function rpAppIdentitySidenavCtrl(
		$scope,
		$rootScope,
		$timeout,
		$mdDialog,
		rpAppIdentityService,
		rpAppSettingsService,
		rpAppIsMobileViewService,
		rpAppLocationService

	) {

		$scope.loading = true;

		rpAppIdentityService.getIdentity(function(identity) {
			console.log('[rpAppIdentitySidenavCtrl] identity: ' + JSON.stringify(identity));
			$scope.identity = identity;
			$scope.loading = false;
			$timeout(angular.noop, 0);

		});


		$scope.$on('$destroy', function() { });
	}
})();