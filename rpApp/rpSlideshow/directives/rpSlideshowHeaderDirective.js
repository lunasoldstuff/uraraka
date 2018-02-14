(function() {
	'use strict';
	angular.module('rpSlideshow').directive('rpSlideshowHeader', [
		'$rootScope',
		rpSlideshowHeader
	]);

	function rpSlideshowHeader($rootScope) {
		return {
			restrict: 'E',
			controller: 'rpSlideshowControlsCtrl',
			link: function(scope, element, attrs) {
				console.log('[rpSlideshowHeader] link');

				element.on('mouseenter', function() {
					$rootScope.$emit('rp_slideshow_mouse_over_header', true);
				});

				element.on('mouseleave', function() {
					$rootScope.$emit('rp_slideshow_mouse_over_header', false);
				});

				scope.$on('$destroy', function() {
					console.log('[rpSlideshowHeader] link destroy');
					element.unbind('mouseenter mouseleave');
				});
			}
		};
	}
})();