var rpProgressControllers = angular.module('rpProgressControllers', []);

rpProgressControllers.controller('rpIndeterminateProgressCtrl', ['$scope', '$rootScope', '$log', '$timeout',

	function($scope, $rootScope, $log, $timeout) {

		$scope.loading = false;

		var deregisterProgressStart = $rootScope.$on('rp_progress_start', function(e, d) {
			console.log('[rpIndeterminateProgressCtrl] rp_progress_start');
			$scope.loading = true;
			$timeout(angular.noop, 0);
		});

		var deregisterProgressStop = $rootScope.$on('rp_progress_stop', function(e, d) {
			console.log('[rpIndeterminateProgressCtrl] rp_progress_stop');
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

		$scope.$on('$destroy', function() {
			deregisterProgressStart();
			deregisterProgressStop();
		});
	}

]);

rpProgressControllers.controller('rpDeterminateProgressCtrl', ['$scope', '$rootScope', '$log', '$timeout', '$interval', 'debounce',
	function($scope, $rootScope, $log, $timeout, $interval, debounce) {
		$scope.value = 0;
		$scope.loading = false;

		var incTimeout = 0;
		var finishInterval;
		var loadingInterval;

		// $interval(function() {
		// 	//console.log('[progress] $SCOPE.VALUE: ' + $scope.value);
		// }, 1000, 0, true);

		var deregisterProgressLoading = $rootScope.$on('progressLoading', function(e, d) {

			console.log('[rpProgressCtrl] progressLoading, $scope.value: ' + $scope.value);

			if ($scope.loading === false) {
				$scope.loading = true;
				startLoading();

			}

		});

		function startLoading() {
			if ($scope.value < 10) {
				$scope.value = 10;
			}

			loadingInterval = $interval(function() {
				if ($scope.value < 90) {
					inc();
				}

			}, 200, 20, true);

		}

		var deregisterProgressComplete = $rootScope.$on('progressComplete', function(e, d) {

			console.log('[rpDeterminateProgressCtrl] progressComplete');

			if (loadingInterval) {
				$interval.cancel(loadingInterval);
			}

			finishInterval = $interval(function() {

				if ($scope.value < 100) {
					console.log('[rpDeterminateProgressCtrl] progressComplete, finishInterval increment');
					$scope.value = $scope.value + 2;
				} else {
					console.log('[rpDeterminateProgressCtrl] progressComplete, finishInterval end');

					$timeout(function() {
						$scope.loading = false;
						$scope.value = 0;
					}, 500);

					$interval.cancel(finishInterval);

				}

			}, 200, 50, true);

		});

		function inc() {
			console.log('[progress] [rpProgressCtrl] inc()');

			var rndInc = 0;
			var valuePercent = $scope.value / 100;

			if (valuePercent >= 0 && valuePercent < 0.25) {
				// rndInc = (Math.random() * 20) / 100;
				rndInc = 0.2;
			} else if (valuePercent >= 0.25 && valuePercent < 0.65) {
				// rndInc = (Math.random() * 10) / 100;
				rndInc = 0.1;
			} else if (valuePercent >= 0.65 && valuePercent < 0.9) {
				// rndInc = (Math.random() * 5) / 100;
				rndInc = 0.05;
			} else {
				rndInc = 0;
			}

			$scope.value += rndInc * 100;
		}

		$scope.$on('$destroy', function() {
			deregisterProgressLoading();
			deregisterProgressComplete();
		});

	}
]);