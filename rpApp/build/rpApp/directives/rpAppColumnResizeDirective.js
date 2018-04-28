'use strict';

(function () {
	'use strict';

	angular.module('rpApp').directive('rpAppColumnResize', ['$rootScope', '$window', 'debounce', 'mediaCheck', rpAppColumnResize]);

	function rpAppColumnResize($rootScope, $window, debounce, mediaCheck) {
		return {
			restrict: 'A',
			link: function link(scope, element, attrs) {

				var emitResizeDrag = function emitResizeDrag(resizeDrag) {
					console.log('[rpAppColumnResize] emit resize drag: ' + resizeDrag);
					$rootScope.$emit('rp_resize_drag', resizeDrag);
				};

				var emitWindowResize = function emitWindowResize(cols) {
					$rootScope.$emit('rp_window_resize', cols);
				};

				mediaCheck.init({
					scope: scope,
					media: [{
						mq: '(max-width: 759px)',
						enter: function enter(mq) {
							if (!isFullscreen()) {
								scope.columns = [1];
								emitWindowResize(1);
							}
							emitResizeDrag(false);
						}

					}, {
						mq: '(min-width: 760px) and (max-width: 1279px)',
						enter: function enter(mq) {

							if (!isFullscreen()) {
								scope.columns = [1, 2];
								emitWindowResize(2);
							}
							emitResizeDrag(true);
						}
					}, {
						mq: '(min-width: 1280px) and (max-width: 1659px)',
						enter: function enter(mq) {
							if (!isFullscreen()) {
								scope.columns = [1, 2, 3];
								emitWindowResize(3);
							}
						}
					}, {
						mq: '(min-width: 1660px)',
						enter: function enter(mq) {
							if (!isFullscreen()) {
								scope.columns = [1, 2, 3, 4];
								emitWindowResize(4);
							}
						}
					}]
				});

				function isFullscreen() {
					console.log('[rpAppColumnResize] isFullscreen(): ' + (window.innerWidth === screen.width && window.innerHeight === screen.height));
					return window.innerWidth === screen.width && window.innerHeight === screen.height;
				}
			}
		};
	}
})();