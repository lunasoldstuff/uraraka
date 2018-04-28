'use strict';

(function () {
	'use strict';

	angular.module('rpApp').directive('rpAppPageContent', ['$rootScope', rpAppPageContent]);

	function rpAppPageContent($rootScope) {
		return {
			restrict: 'C',
			link: function link(scope, element, attrs) {

				var step = 16;

				var deregisterScrollUp = $rootScope.$on('scroll_down', function () {
					stepDown();
				});

				var deregisterScrollDown = $rootScope.$on('scroll_up', function () {
					stepUp();
				});

				// var deregisterTabsShow = $rootScope.$on('rp_tabs_show', function() {
				// 	moveUp();
				// });
				//
				// var deregisterTabsHide = $rootScope.$on('rp_tabs_hide', function() {
				// 	moveDown();
				// });

				function stepUp() {
					if (parseInt(element.css('top')) < 0) {
						element.css('top', '+=' + step);
					}
				}

				function stepDown() {
					if (parseInt(element.css('top')) > -48) {
						element.css('top', '-=' + step);
					}
				}

				function moveUp() {
					if (parseInt(element.css('top')) < 0) {
						element.css('top', 0);
					}
				}

				function moveDown() {
					if (parseInt(element.css('top')) > -48) {
						element.css('top', -48);
					}
				}

				scope.$on('$destroy', function () {
					deregisterScrollUp();
					deregisterScrollDown();
					// deregisterTabsShow();
					// deregisterTabsHide();
				});
			}
		};
	}
})();