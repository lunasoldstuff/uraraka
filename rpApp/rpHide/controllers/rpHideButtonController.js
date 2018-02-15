(function() {
	'use strict';
	angular.module('rpHide').controller('rpHideButtonCtrl', [
		'$scope',
		'$rootScope',
		'rpHideUtilService',
		'rpAppAuthService',
		'rpToastService',
		rpHideButtonCtrl
	]);

	function rpHideButtonCtrl(
		$scope,
		$rootScope,
		rpHideUtilService,
		rpAppAuthService,
		rpToastService
	) {

		console.log('[rpHideButtonCtrl] $scope.isHidden: ' + $scope.isHidden);

		$scope.hide = function() {

			console.log('[rpHideButtonCtrl] hide(), $scope.redditId: ' + $scope.redditId);
			console.log('[rpHideButtonCtrl] hide(), $scope.parentCtrl.$id: ' + $scope.parentCtrl.$id);

			if (rpAppAuthService.isAuthenticated) {
				rpHideUtilService($scope.redditId, $scope.isHidden, function(err, data) {
					if (err) {
						console.log('[rpHideButtonCtrl] err');
					} else {
						console.log('[rpHideButtonCtrl] success');
						// $scope.parentCtrl.completeHiding($scope.redditId);
						$scope.$emit('rp_hide_post', $scope.redditId);
					}
				});

			} else {
				rpToastService("you must log in to hide posts", "sentiment_neutral");
			}

		};

	}

})();