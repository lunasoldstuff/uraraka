'use strict';

(function () {
	'use strict';

	angular.module('rpGild').controller('rpGildButtonCtrl', ['$scope', 'rpGildService', 'rpAppAuthService', 'rpToastService', rpGildButtonCtrl]);

	function rpGildButtonCtrl($scope, rpGildService, rpAppAuthService, rpToastService) {

		console.log('[rpGildButtonCtrl]');

		$scope.gild = function () {

			if (rpAppAuthService.isAuthenticated) {

				rpGildService($scope.redditId, function (err, data) {

					if (err) {
						console.log('[rpGildButtonCtrl] err');
					} else {
						console.log('[rpGildButtonCtrl] success');
						$scope.gilded++;
					}
				});
			} else {
				rpToastService("you must log in to gild posts", "sentiment_neutral");
			}
		};
	}
})();