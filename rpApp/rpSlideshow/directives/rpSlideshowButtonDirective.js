(function() {
	'use strict';
	angular.module('rpSlideshow').directive('rpSlideshowButton', [rpSlideshowButton]);

	function rpSlideshowButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpSlideshow/views/rpSlideshowButton.html',
			controller: 'rpSlideshowButtonCtrl'
		};
	}
})();