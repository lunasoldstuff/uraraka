var rpDirectives = angular.module('rpDirectives', []);









rpDirectives.directive('rpSocialButtons', [function() {
	return {
		restrict: 'E',
		templateUrl: 'rpSocialButtons.html'
	};
}]);



rpDirectives.directive('rpLinkResponsiveAd', [
	function() {
		return {
			restrict: 'E',
			templateUrl: 'rpLinkResponsiveAd.html'
		};
	}
]);



rpDirectives.directive('rpSidenavContent', [
	'$templateCache',
	'$timeout',
	'$mdMedia',
	function(
		$templateCache,
		$timeout,
		$mdMedia
	) {
		return {
			restrict: 'E',
			replace: true,
			template: $templateCache.get('rpSidenavContent.html'),
			link: function(scope, elem, attrs) {
				$timeout(function() {
					scope.showSidenav = $mdMedia('gt-md');

				}, 0);
				scope.$watch(function() {
					return $mdMedia('gt-md');
				}, function(showSidenav) {
					$timeout(function() {
						scope.showSidenav = showSidenav;

					}, 0);
				});

			}
		};
	}
]);

// rpDirectives.directive('rpSidebar', function() {
// 	return {
// 		restrict: 'E',
// 		replace: true,
// 		templateUrl: 'rpSidebar.html',
// 		controller: 'rpSidebarCtrl'
// 	};
// });









rpDirectives.directive('rpFormatting', [function() {
	return {
		restrict: 'E',
		templateUrl: 'rpFormatting.html',
	};

}]);




/*
	use this comile directive instead of ng-bind-html in comment template becase we add our rpCommentMedia
	directive and unless the html is compiled again angular won't pick up on it.
	SO Question:
	http://stackoverflow.com/questions/17417607/angular-ng-bind-html-unsafe-and-directive-within-it
 */

rpDirectives.directive('compile', ['$compile', '$sce',
	function($compile, $sce) {
		return {
			link: function(scope, element, attrs) {
				var ensureCompileRunsOnce = scope.$watch(function(scope) {
						return $sce.parseAsHtml(attrs.compile)(scope);
					},
					function(value) {
						// when the parsed expression changes assign it into the current DOM
						element.html(value);

						// compile the new DOM and link it to the current scope.
						$compile(element.contents())(scope);

						// Use un-watch feature to ensure compilation happens only once.
						ensureCompileRunsOnce();
					});
			}
		};
	}
]);

rpDirectives.directive('rpFab', ['$rootScope', function($rootScope) {
	return {
		restrict: 'C',
		link: function(scope, element, attrs) {

			var deregisterScrollUp = $rootScope.$on('scroll_down', function() {
				if (parseInt(element.children('ul').css('bottom')) > -100)
					element.children('ul').css('bottom', '-=25');
				else
					element.children('ul').css('bottom', '-100px');
			});

			var deregisterScrollDown = $rootScope.$on('scroll_up', function() {
				if (parseInt(element.children('ul').css('bottom')) < 0)
					element.children('ul').css('bottom', '+=25');
				else
					element.children('ul').css('bottom', '0px');
			});

			scope.$on('$destroy', function() {
				deregisterScrollUp();
				deregisterScrollDown();
			});

		}
	};
}]);

rpDirectives.directive('rpFocusMe', ['$timeout', '$parse', function($timeout, $parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.rpFocusMe);
			console.log('[rpFocusMe] link function load, model: ' + model);

			scope.$watch(model, function(value) {
				console.log('[rpFocusMe] $watch, value: ' + value);

				if (value === true) {
					$timeout(function() {
						element[0].focus();
					});
				}

			});

			element.bind('blur', function() {
				console.log('[rpFocusMe] blur');
				scope.$apply(model.assign(scope, false));

			});

		}
	};
}]);

rpDirectives.directive('rpMain', ['$animate', function($animate) {
	return {
		restrict: 'C',
		link: function(scope, element, attrs) {
			$animate.on('enter', element[0], function callback(element, phase) {
				if (element.hasClass('rp-main')) {
					console.log('[rpMain] .rp-main animation');
					console.log('[rpMain] animate enter listener, phase: ' + phase);
					if (phase === 'close') {
						console.log('[rpMain] broadcast md-resize-textarea...');
						scope.$broadcast('md-resize-textarea');

					}

				}
			});

		}
	};
}]);



rpDirectives.directive('rpInfiniteScroll', ['$rootScope', 'debounce', function($rootScope, debounce) {
	return {
		restrict: 'A',

		link: function(scope, element, attrs) {
			console.log('[rpInfiniteScroll] link()');

			var scrollDiv = attrs.rpInfiniteScrollDiv; //div to inf scroll on
			var scrollDistance = attrs.rpInfiniteScrollDistance; //multiple of div length to trigger inf scroll


			var deregisterLoadMoreClick = $rootScope.$on('rp_load_more', function() {
				scope.loadMore();
			});

			var debouncedLoadMore = debounce(300, function() {
				if (scope.noMorePosts === undefined || scope.noMorePosts === false) {

					if (angular.element(scrollDiv).outerHeight() - element.scrollTop() <=
						element.outerHeight() * scrollDistance) {
						console.log('[rpInfiniteScroll] call loadMorePosts');
						scope.morePosts();
					}
				}
			}, true);

			element.on('scroll', function() {
				// requestAnimationFrame(debounce(loadMore(), 3000));
				// debounce(requestAnimationFrame(loadMore), 3000);
				debouncedLoadMore();
			});
		}
	};
}]);

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