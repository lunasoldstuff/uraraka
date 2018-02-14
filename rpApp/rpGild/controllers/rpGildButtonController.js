(function() {
	'use strict';
	angular.module('rpGild').controller('rpGildButtonCtrl', [
		'$scope',
		'rpGildUtilService',
		'rpAppAuthService',
		'rpAppToastService',
		rpGildButtonCtrl
	]);

	function rpGildButtonCtrl(
		$scope,
		rpGildUtilService,
		rpAppAuthService,
		rpAppToastService
	) {

		console.log('[rpGildButtonCtrl]');

		$scope.gild = function() {

			if (rpAppAuthService.isAuthenticated) {

				rpGildUtilService($scope.redditId, function(err, data) {

					if (err) {
						console.log('[rpGildButtonCtrl] err');
					} else {
						console.log('[rpGildButtonCtrl] success');
						$scope.gilded++;
					}

				});

			} else {
				rpAppToastService("you must log in to gild posts", "sentiment_neutral");
			}
		};
	}

})();