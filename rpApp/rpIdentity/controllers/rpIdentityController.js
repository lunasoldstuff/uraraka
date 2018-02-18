(function() {
	'use strict';
	angular.module('rpIdentity').controller('rpIdentityCtrl', [
		'$scope',
		'$rootScope',
		'$timeout',
		'$mdDialog',
		'rpIdentityService',
		'rpAppSettingsService',
		'rpAppIsMobileViewService',
		'rpAppLocationService',
		rpIdentityCtrl
	]);

	function rpIdentityCtrl(
		$scope,
		$rootScope,
		$timeout,
		$mdDialog,
		rpIdentityService,
		rpAppSettingsService,
		rpAppIsMobileViewService,
		rpAppLocationService

	) {

		$scope.loading = true;

		rpIdentityService.getIdentity(function(identity) {
			console.log('[rpIdentityCtrl] identity: ' + JSON.stringify(identity));
			$scope.identity = identity;
			$scope.loading = false;
			$timeout(angular.noop, 0);

		});


		$scope.$on('$destroy', function() {});
	}
})();