'use strict';

(function () {
	'use strict';

	angular.module('rpSlideshow').controller('rpSlideshowProgressCtrl', ['$scope', '$rootScope', '$timeout', 'rpSettingsService', rpSlideshowProgressCtrl]);

	function rpSlideshowProgressCtrl($scope, $rootScope, $timeout, rpSettingsService) {
		console.log('[rpSlideshowProgressCtrl]');

		$scope.showProgress = false;
		var cancelTickProgress;
		var slideshowTime = rpSettingsService.settings.slideshowTime;
		console.log('[rpSlideshowProgressCtrl] slideshowTime: ' + slideshowTime);

		function startProgress() {

			$scope.slideshowProgress = 100;
			$scope.showProgress = true;
			var startTime = new Date();
			console.log('[rpSlideshowProgressCtrl] startProgress(), startTime: ' + startTime.valueOf());

			function tickProgress() {
				var timeElapsed = new Date() - startTime;
				console.log('[rpSlideshowProgressCtrl] tickProgress(), timeElapsed: ' + timeElapsed.valueOf());

				if (timeElapsed > slideshowTime) {
					stopProgress();
				} else {
					$scope.slideshowProgress = (slideshowTime - timeElapsed) / slideshowTime * 100;
					console.log('[rpSlideshowProgressCtrl] tickProgress(), $scope.slideshowProgress: ' + $scope.slideshowProgress);
					$timeout(angular.noop, 0);
					cancelTickProgress = $timeout(tickProgress, 500);
				}
			}

			tickProgress();
		}

		function stopProgress() {
			$scope.slideshowProgress = 0;
			$scope.showProgress = false;
			$timeout(angular.noop, 0);
			$timeout.cancel(cancelTickProgress);
		}

		var deregisterStartProgress = $rootScope.$on('rp_slideshow_progress_start', function () {
			console.log('[rpSlideshowProgressCtrl] rp_slideshow_progress_start');
			startProgress();
		});

		var deregisterStopProgress = $rootScope.$on('rp_slideshow_progress_stop', function () {
			console.log('[rpSlideshowProgressCtrl] rp_slideshow_progress_stop');
			stopProgress();
		});

		$scope.$on('$destroy', function () {
			deregisterStartProgress();
			deregisterStopProgress();
		});
	}
})();