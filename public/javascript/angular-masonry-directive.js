(function() {
	"use strict";

	angular.module('masonry', ['ng']).directive('masonry', function($timeout) {
		return {
			restrict: 'AC',
			link: function(scope, elem, attrs) {
				var container = elem[0];
				var options = angular.extend({
					itemSelector: '.item'
				}, angular.fromJson(attrs.masonry));

				var masonry = scope.masonry = new Masonry(container, options);

				var debounceTimeout = 0;
				scope.update = function() {

					if (debounceTimeout) {
						//console.log('[angular-masonry-directive] scope.update() debounced');
						$timeout.cancel(debounceTimeout);
					}
					debounceTimeout = $timeout(function() {
						console.log('[angular-masonry-directive] update');
						//console.log('[angular-masonry-directive] scope.update() called');
						debounceTimeout = 0;

						masonry.reloadItems();
						masonry.layout();

						elem.children(options.itemSelector).css('visibility', 'visible');
					}, 120);
				};

				scope.removeBrick = function() {
					////console.log('[angular-masonry-directive] removeBrick()');
					$timeout(function() {
						masonry.reloadItems();
						masonry.layout();
					}, 500);
				};

				scope.appendBricks = function(ele) {
					////console.log('[angular-masonry-directive] appendBricks()');
					masonry.appended(ele);
				};

				scope.$on('masonry.layout', function() {
					//console.log('[angular-masonry-directive] onMasonryLayout');
					masonry.layout();
				});

				scope.$on('angular_masonry_directive_update', function() {
					//console.log('[angular-masonry-directive] angular_masonry_directive_update');
					scope.update();

				});

				// scope.$on('angular_masonry_directive_update_dont_reload', function() {
				// 	console.log('[angular-masonry-directive] update dont relaod');
				// 	if (debounceTimeout) {
				// 		//console.log('[angular-masonry-directive] scope.update() debounced');
				// 		$timeout.cancel(debounceTimeout);
				// 	}
				// 	debounceTimeout = $timeout(function() {
				// 		//console.log('[angular-masonry-directive] scope.update() called');
				// 		debounceTimeout = 0;
				//
				// 		masonry.layout();
				//
				// 		elem.children(options.itemSelector).css('visibility', 'visible');
				// 	}, 50);
				// });

				scope.update();
			}
		};
	}).directive('masonryTile', function() {
		return {
			restrict: 'AC',
			link: function(scope, elem) {
				elem.css('visibility', 'hidden');
				var master = elem.parent('*[masonry]:first').scope(),
					update = master.update,
					removeBrick = master.removeBrick,
					appendBricks = master.appendBricks;
				// if (update) {
				// 	////console.log('[angular-masonry-tile] update');
				// 	imagesLoaded(elem.get(0), update);
				// 	elem.ready(update);
				// }
				if (appendBricks) {
					////console.log('[angular-masonry-tile] appendBricks');
					imagesLoaded(elem.get(0), appendBricks(elem));
				}

				var prevHeight;
				var triggered = false;


				scope.$watch(function() {
					return elem.height();
				}, function(height) {
					// scope.$emit('angular_masonry_directive_update');

					elem.ready(update);
				});


				// scope.$watch(function() {
				// 	return elem.height();
				// }, function(height) {
				// 	// scope.$emit('angular_masonry_directive_update');
				//
				// 	elem.ready(update);
				// 	// imagesLoaded(elem.get(0), appendBricks(elem));
				//
				// 	// console.log('[angular-masonry-tile] triggered: ' + triggered);
				// 	//
				// 	//
				// 	// if (triggered) {
				// 	// 	console.log('[angular-masonry-tile] prevHeight: ' + prevHeight + ', height: ' + height);
				// 	//
				// 	// 	if (prevHeight && height > prevHeight) {
				// 	// 		scope.$emit('angular_masonry_directive_update_dont_reload');
				// 	// 		prevHeight = height;
				// 	// 	} else {
				// 	// 		// setTimeout(function() {
				// 	// 		// 	scope.$emit('angular_masonry_directive_update_dont_reload');
				// 	// 		//
				// 	// 		// }, 500);
				// 	// 	}
				// 	//
				// 	// 	prevHeight = height;
				// 	//
				// 	// } else {
				// 	// 	triggered = true;
				// 	// }
				//
				//
				// });

				scope.$on('$destroy', function() {
					if (removeBrick) {
						removeBrick();
					}
				});
			}
		};
	});
})();