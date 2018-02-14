(function() {
	'use strict';
	angular.module('rpShare').controller('rpShareEmailCtrl', [
		'$scope',
		'$rootScope',
		'$routeParams',
		'rpAppIdentityService',
		'rpAppTitleChangeService',
		rpShareEmailCtrl
	]);

	function rpShareEmailCtrl(
		$scope,
		$rootScope,
		$routeParams,
		rpAppIdentityService,
		rpAppTitleChangeService

	) {

		console.log('[rpShareCtrl]');

		rpAppIdentityService.getIdentity(function(identity) {
			console.log('[rpShareEmailCtrl] identity: ' + JSON.stringify(identity));
			$scope.identity = identity;

			if ($routeParams.shareTitle) {
				$scope.shareTitle = $routeParams.shareTitle;
			}

			if ($routeParams.shareLink) {
				$scope.shareLink = $routeParams.shareLink;
			}

			if (!$scope.dialog) {
				$rootScope.$emit('rp_hide_all_buttons');
				$rootScope.$emit('rp_tabs_hide');
			}

			if (!$scope.dialog) {
				rpAppTitleChangeService("share via email", true, true);
			}

		});
	}
})();