'use strict';

(function () {
	'use strict';

	angular.module('rpSlideshow').controller('rpSlideshowControlsCtrl', ['$scope', '$rootScope', rpSlideshowControlsCtrl]);

	function rpSlideshowControlsCtrl($scope, $rootScope) {
		console.log('[rpSlideshowControlsCtrl]');

		$scope.playPause = function () {
			console.log('[rpSlideshowControlsCtrl] play/pause');
			$rootScope.$emit('rp_slideshow_play_pause');
		};

		$scope.next = function () {
			console.log('[rpSlideshowControlsCtrl] next');
			$rootScope.$emit('rp_slideshow_next');
		};

		$scope.prev = function () {
			console.log('[rpSlideshowControlsCtrl] prev');
			$rootScope.$emit('rp_slideshow_prev');
		};
	}
})();