(function() {
	'use strict';
	angular.module('rpSidenav').directive('rpSidenavFooter', [
		'$rootScope',
		rpSidenavFooter
	]);

	function rpSidenavFooter($rootScope) {
		return {
			restrict: 'C',
			link: function(scope, element, attrs) {

				var step = 16;

				var deregisterScrollUp = $rootScope.$on('scroll_up', function() {
					console.log('[rpSidenavFooter] onScrollUp()');
					stepDown();
				});

				var deregisterScrollDown = $rootScope.$on('scroll_down', function() {
					stepUp();
				});

				var deregisterTabsShow = $rootScope.$on('rp_tabs_show', function() {
					moveDown();
				});

				var deregisterTabsHide = $rootScope.$on('rp_tabs_hide', function() {
					moveUp();
				});

				function stepDown() {
					if (parseInt(element.css('margin-bottom')) < 48) {
						element.css('margin-bottom', '+=' + step);
					}

				}

				function stepUp() {
					if (parseInt(element.css('margin-bottom')) !== 0) {
						element.css('margin-bottom', '-=' + step);
					}

				}

				function moveDown() {
					if (parseInt(element.css('margin-bottom')) < 48) {
						element.css('margin-bottom', 48);
					}

				}

				function moveUp() {
					if (parseInt(element.css('margin-bottom')) !== 0) {
						element.css('margin-bottom', 0);
					}

				}

				scope.$on('$destroy', function() {
					deregisterScrollUp();
					deregisterScrollDown();
					deregisterTabsHide();
					deregisterTabsShow();
				});

			}
		};
	}
})();