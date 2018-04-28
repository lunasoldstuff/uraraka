'use strict';

(function () {
	'use strict';

	angular.module('rpSlideshow').directive('rpSlideshowButton', [rpSlideshowButton]);

	function rpSlideshowButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpSlideshow/views/rpSlideshowButton.html',
			controller: 'rpSlideshowButtonCtrl',
			link: function link(scope, elem, attrs) {
				console.log('[rpSlideshowButton] link()');
				if ('rpToolbarOverflowMenu' in attrs) {
					elem.find('.md-icon-button').removeClass('md-icon-button');
				}
			}
		};
	}
})();