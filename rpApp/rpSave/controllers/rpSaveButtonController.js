(function() {
	'use strict';
	angular.module('rpSave').controller('rpSaveButtonCtrl', [
		'$scope',
		'rpSaveUtilService',
		'rpAppAuthService',
		'rpAppToastService',
		rpSaveButtonCtrl
	]);

	function rpSaveButtonCtrl(
		$scope,
		rpSaveUtilService,
		rpAppAuthService,
		rpAppToastService

	) {

		$scope.save = function() {
			if (rpAppAuthService.isAuthenticated) {

				$scope.saved = !$scope.saved;

				rpSaveUtilService($scope.redditId, $scope.saved, function(err, data) {
					if (err) {
						console.log('[rpSaveButtonCtrl] err');
					} else {
						console.log('[rpSaveButtonCtrl] success');

					}
				});

			} else {
				rpAppToastService("you must log in to save posts", "sentiment_neutral");
			}


		};

	}
})();