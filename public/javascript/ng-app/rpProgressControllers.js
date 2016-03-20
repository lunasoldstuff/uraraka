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

rpProgressControllers.controller('rpDeterminateProgressCtrl', ['$scope', '$rootScope', '$log', '$timeout', '$interval',
	function($scope, $rootScope, $log, $timeout, $interval) {
		$scope.value = 0;
		$scope.loading = false;

		var incTimeout = 0;
		var finishProgress;

		// $interval(function() {
		// 	//console.log('[progress] $SCOPE.VALUE: ' + $scope.value);
		// }, 1000, 0, true);

		var deregisterProgressLoading = $rootScope.$on('progressLoading', function(e, d) {

			// $log.log('[progress] progressLoading, $scope.value: ' + $scope.value);

			if ($scope.loading === false) {
				$scope.loading = true;
				setProgressInterval(false);

			} else {
				$scope.value = 10;

			}

		});

		function setProgressInterval(finish) {
			$interval(function() {

				if ($scope.value < 90 || finish) {
					inc();
				}

			}, 300, 40, true);

		}

		var deregisterProgress = $rootScope.$on('progress', function(e, d) {

			// $log.log('[progress] progress_event: ' + d.value);
			set(d.value);
		});

		var deregisterProgressComplete = $rootScope.$on('progressComplete', function(e, d) {

			console.log('[rpDeterminateProgressCtrl] progressComplete');

			// finishProgress = $interval(function() {
			//
			// 	if ($scope.value < 100) {
			// 		$scope.value = $scope.value + 2;
			// 	} else {
			//
			// 		$timeout(function() {
			// 			$scope.loading = false;
			// 			$scope.value = 0;
			// 			//console.log('[progress] [PROGRESS COMPLETE TIMEOUT, RESET LOADER.] $scope.value: ' + $scope.value);
			// 		}, 500);
			//
			// 		$interval.cancel(finishProgress);
			// 	}
			//
			// }, 100, 100, false);

			setProgressInterval(true);

		});

		function set(n) {
			if ($scope.loading === false) return;

			if ($scope.value < n) {
				$scope.value = n;
			}
		}

		function inc() {
			//console.log('[progress] [rpProgressCtrl] inc()');

			var rnd = 0;
			var stat = $scope.value / 100;

			if (stat >= 0 && stat < 0.25) {
				// Start out between 3 - 6% increments
				rnd = (Math.random() * 20) / 100;
			} else if (stat >= 0.25 && stat < 0.65) {
				// increment between 0 - 3%
				rnd = (Math.random() * 10) / 100;
			} else if (stat >= 0.65 && stat < 0.9) {
				// increment between 0 - 2%
				rnd = (Math.random() * 5) / 100;
				// } else if (stat >= 0.9 && stat < 0.99) {
				// 	// finally, increment it .5 %
				// 	rnd = 0.005;
			} else {
				// after 99%, don't increment:
				rnd = 0;
			}

			// $log.log("[progress] [rpProgressControllers] inc(): RANDOM INC: " + rnd + ', $scope.value: ' + $scope.value);
			set($scope.value + rnd * 100);
		}

		$scope.$on('$destroy', function() {
			deregisterProgressLoading();
			deregisterProgress();
			deregisterProgressComplete();
		});

	}
]);