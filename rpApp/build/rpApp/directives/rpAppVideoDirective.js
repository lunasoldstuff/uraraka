'use strict';

(function () {
	'use strict';

	angular.module('rpApp').directive('video', ['$rootScope', '$timeout', video]);

	function video($rootScope, $timeout) {
		return {
			restrict: 'E',
			link: function link(scope, element, attrs) {
				console.log('[video] link');
				element.on('canplay', function () {
					element.removeClass('landscape');
					element.removeClass('portrait');
					element.removeClass('square');

					$timeout(function () {
						element.show();

						var width = parseInt(element.width());
						var height = parseInt(element.height());

						console.log('[video] link(), width: ' + width + ', height: ' + height);

						if (width === height) {
							element.addClass('square');
						} else if (width > height) {
							element.addClass('landscape');
						} else {
							element.addClass('portrait');
						}
					}, 0);
				});

				element.on('play', function () {
					$rootScope.$emit('rp_slideshow_video_start');
				});

				element.on('timeupdate', function () {
					if (element.prop('currentTime') > element.prop('duration') - 0.5) {
						$rootScope.$emit('rp_slideshow_video_end');
						element.off('timeupdate');
					}
				});
			}
		};
	}
})();