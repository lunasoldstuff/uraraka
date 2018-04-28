'use strict';

(function () {
	'use strict';

	angular.module('rpApp').controller('rpAppProgressCtrl', ['$scope', '$rootScope', '$log', '$timeout', rpAppProgressCtrl]);

	function rpAppProgressCtrl($scope, $rootScope, $log, $timeout) {

		$scope.loading = false;

		var deregisterProgressStart = $rootScope.$on('rp_progress_start', function (e, d) {
			console.log('[rpAppProgressCtrl] rp_progress_start');
			$scope.loading = true;
			$timeout(angular.noop, 0);
		});

		var deregisterProgressStop = $rootScope.$on('rp_progress_stop', function (e, d) {
			console.log('[rpAppProgressCtrl] rp_progress_stop');
			$scope.loading = false;
			$timeout(angular.noop, 0);
		});

		// $rootScope.$on('$locationChangeStart', function() {
		// 	$scope.loading = true;
		// });
		//
		// $rootScope.$on('$locationChangeSuccess', function() {
		// 	$scope.loading = false;
		// });

		$scope.$on('$destroy', function () {
			deregisterProgressStart();
			deregisterProgressStop();
		});
	}
})();