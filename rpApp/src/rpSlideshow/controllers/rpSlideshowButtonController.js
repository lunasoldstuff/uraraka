(function() {
	'use strict';
	angular.module('rpSlideshow').controller('rpSlideshowButtonCtrl', [
		'$scope',
		'$rootScope',
		rpSlideshowButtonCtrl
	]);

	function rpSlideshowButtonCtrl($scope, $rootScope) {
		console.log('[rpSlideshowButtonCtrl] load');
		$scope.startSlideshow = function() {
			console.log('[rpSlideshowButtonCtrl] startSlideshow()');
			$rootScope.$emit('rp_slideshow_start');
		};
	}
})();