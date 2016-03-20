var rpProgressControllers = angular.module('rpProgressControllers', []);

/*
	Progress bar controller.
	based on https://github.com/chieffancypants/angular-loading-bar
	need to adjust increment numbers, loading bar can finish then jump back when refreshing.
 */
rpProgressControllers.controller('rpIndeterminateProgressCtrl', ['$scope', '$rootScope', '$log', '$timeout',

	function($scope, $rootScope, $log, $timeout) {

		$scope.loading = false;

		var deregisterProgressLoading = $rootScope.$on('progressLoading', function(e, d) {
			// $log.log('progressLoading');
			$scope.loading = true;
		});

		var deregisterProgressComplete = $rootScope.$on('progressComplete', function(e, d) {
			// $log.log('progressComplete');
			$scope.loading = false;
		});

		$rootScope.$on('$locationChangeStart', function() {
			$scope.loading = true;
		});

		$rootScope.$on('$locationChangeSuccess', function() {
			$scope.loading = false;
		});

		$scope.$on('$destroy', function() {
			deregisterProgressLoading();
			deregisterProgressComplete();
		});
	}
]);

rpProgressControllers.controller('rpDeterminateProgressCtrl', ['$scope', '$rootScope', '$log', '$timeout', '$interval', 'debounce',
	function($scope, $rootScope, $log, $timeout, $interval, debounce) {
		$scope.value = 0;
		$scope.loading = false;

		var incTimeout = 0;
		var finishProgress;
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
				// loadingInterval.cancel();
			}

			finishInterval = $interval(function() {

				if ($scope.value < 100) {
					$scope.value = $scope.value + 2;
				} else {
					$interval.cancel(finishInterval);
					$timeout(function() {
						$scope.loading = false;
						$scope.value = 0;
					}, 500);

				}

			}, 200, 5, true);

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
			deregisterProgress();
			deregisterProgressComplete();
		});

	}
]);