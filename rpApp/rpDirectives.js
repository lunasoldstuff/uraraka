var rpDirectives = angular.module('rpDirectives', []);









rpDirectives.directive('rpPageContent', ['$rootScope', function($rootScope) {
	return {
		restrict: 'C',
		link: function(scope, element, attrs) {

			var step = 16;

			var deregisterScrollUp = $rootScope.$on('scroll_down', function() {
				stepDown();
			});

			var deregisterScrollDown = $rootScope.$on('scroll_up', function() {
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


			scope.$on('$destroy', function() {
				deregisterScrollUp();
				deregisterScrollDown();
				// deregisterTabsShow();
				// deregisterTabsHide();
			});

		}
	};
}]);

rpDirectives.directive('rpSidenavFooter', ['$rootScope', function($rootScope) {
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
}]);