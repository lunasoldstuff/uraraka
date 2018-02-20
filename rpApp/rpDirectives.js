var rpDirectives = angular.module('rpDirectives', []);









rpDirectives.directive('rpColumnResize', [
	'$rootScope',
	'$window',
	'debounce',
	'mediaCheck',
	function(
		$rootScope,
		$window,
		debounce,
		mediaCheck
	) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {

				var emitResizeDrag = function(resizeDrag) {
					console.log('[rpColumnResize] emit resize drag: ' + resizeDrag);
					$rootScope.$emit('rp_resize_drag', resizeDrag);
				};

				var emitWindowResize = function(cols) {
					$rootScope.$emit('rp_window_resize', cols);

				};

				mediaCheck.init({
					scope: scope,
					media: [{
						mq: '(max-width: 759px)',
						enter: function(mq) {
							if (!isFullscreen()) {
								scope.columns = [1];
								emitWindowResize(1);
							}
							emitResizeDrag(false);
						}

					}, {
						mq: '(min-width: 760px) and (max-width: 1279px)',
						enter: function(mq) {

							if (!isFullscreen()) {
								scope.columns = [1, 2];
								emitWindowResize(2);
							}
							emitResizeDrag(true);
						}
					}, {
						mq: '(min-width: 1280px) and (max-width: 1659px)',
						enter: function(mq) {
							if (!isFullscreen()) {
								scope.columns = [1, 2, 3];
								emitWindowResize(3);
							}
						}
					}, {
						mq: '(min-width: 1660px)',
						enter: function(mq) {
							if (!isFullscreen()) {
								scope.columns = [1, 2, 3, 4];
								emitWindowResize(4);
							}
						}
					}]
				});

				function isFullscreen() {
					console.log('[rpColumnResize] isFullscreen(): ' + (window.innerWidth === screen.width && window.innerHeight === screen.height));
					return window.innerWidth === screen.width && window.innerHeight === screen.height;
				}
			}
		};
	}
]);

rpDirectives.directive('rpFastScroll', [
	'$rootScope',
	'$timeout',
	'debounce',
	function(
		$rootScope,
		$timeout,
		debounce
	) {
		return {
			link: function(scope, element, attrs) {


			}
		};
	}
]);

rpDirectives.directive('rpSuspendable', [
	'$rootScope',
	'$timeout',

	function(
		$rootScope,
		$timeout

	) {
		return {
			link: function(scope, element) {
				// console.log('[rpSuspendable] scope.$id: ' + scope.$id);
				var watchers = [];
				var inView;
				var resumeTimeout;
				var suspendTimeout;

				scope.inView = function($index, $inview) {
					// console.log('[rpSuspendable] inView(), $inview: ' + $inview);
					inView = $inview;
					if ($inview) {
						resumeWatchers();
					} else {
						suspendWatchers();
					}
				};


				function suspendWatchers() {

					if (suspendTimeout || resumeTimeout) {

					} else {
						if (scope.$$watchers !== 0) {
							iterateSiblings(scope, suspendScopeWatchers);
							iterateChildren(scope, suspendScopeWatchers);

						}

						suspendTimeout = $timeout(function() {
							suspendTimeout = null;
						}, 300);
					}

				}

				function resumeWatchers() {

					if (resumeTimeout) {
						$timeout.cancel(resumeTimeout);
					}

					resumeTimeout = $timeout(function() {
						iterateSiblings(scope, resumeScopeWatchers);
						iterateChildren(scope, resumeScopeWatchers);
						resumeTimeout = null;
					}, 100);

				}

				function suspendScopeWatchers(scope) {
					if (!watchers[scope.$id]) {
						watchers[scope.$id] = scope.$$watchers || [];
						scope.$$watchers = [];
					}
				}

				function resumeScopeWatchers(scope) {
					if (watchers[scope.$id]) {
						scope.$$watchers = watchers[scope.$id];
						if (scope.hasOwnProperty('$watch')) delete scope.$watch;
						watchers[scope.$id] = false;
					}
				}

				function iterateSiblings(scope, operationOnScope) {
					while (!!(scope = scope.$$nextSibling)) {
						operationOnScope(scope);
						iterateChildren(scope, operationOnScope);
					}
				}

				function iterateChildren(scope, operationOnScope) {
					while (!!(scope = scope.$$childHead)) {
						operationOnScope(scope);
						iterateSiblings(scope, operationOnScope);
					}
				}

				var deregisterSuspend = $rootScope.$on('rp_suspendable_suspend', function() {
					console.log('[rpSuspendable] rp_suspendable_suspend');
					suspendWatchers();
				});

				var deregisterResume = $rootScope.$on('rp_suspendable_resume', function() {
					console.log('[rpSuspendable] rp_suspendable_resume');
					resumeWatchers();
				});

				var deregisterSuspendResume = $rootScope.$on('rp_suspendable_suspend_resume', function() {
					if (inView) {
						resumeWatchers();
					} else {
						suspendWatchers();
					}
				});

				scope.$on('$destroy', function() {
					deregisterSuspend();
					deregisterResume();
					deregisterSuspendResume();
				});
			}
		};
	}
]);

// rpDirectives.directive('rpSimpleSuspendable', ['$rootScope',
// 	function($rootScope) {

// 		return {
// 			restrict: 'A',
// 			link: function(scope) {
// 				console.log('[rpSimpleSuspendable] loaded.');
// 				var watchers;

// 				var removeWatchers = function() {
// 					console.log('[rpSimpleSudpendable] rp_simple_suspendable_suspend');
// 					watchers = scope.$$watchers;
// 					scope.$$watchers = [];
// 				};

// 				var restoreWatchers = function() {
// 					console.log('[rpSimpleSudpendable] rp_simple_suspendable_restore');
// 					if (!scope.$$watchers || scope.$$watchers.length === 0) {
// 						scope.$$watchers = watchers;
// 					} else {
// 						scope.$$watchers = scope.$$watchers.concat(watchers);
// 						watchers = void 0;
// 					}
// 				};

// 				scope.inView = function($index, $inview) {
// 					console.log('[rpSimpleSuspendable] inView(), $inview: ' + $inview);
// 					if ($inview) {
// 						restoreWatchers(scope, 0);
// 					} else {
// 						removeWatchers(scope, 0);
// 					}
// 				};

// 				scope.$on('$destroy', function() {
// 					deregisterSuspend();
// 					deregisterRestore();
// 				});

// 			}
// 		};


// 	}
// ]);


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