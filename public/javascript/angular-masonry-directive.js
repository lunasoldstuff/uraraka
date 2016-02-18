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

				scope.update();
			}
		};
	}).directive('masonryTile', ['$timeout', function($timeout) {
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


				var heightWatched = false;

				// scope.$on('rp_angular_masonry_tile_watch_height', function() {
				// 	console.log('[masonryTile] rp_angular_masonry_tile_watch_height');
				//
				//
				// 	if (!heightWatched) {
				// 		scope.$watch(function() {
				// 			return elem.height();
				// 		}, function(newHeight, oldHeight) {
				// 			heightWatched = true;
				// 			console.log('[masonryTile] height change, oldHeight: ' + oldHeight + ', newHeight: ' + newHeight);
				// 			if (newHeight !== oldHeight) {
				// 				scope.$emit('angular_masonry_directive_update');
				//
				// 			}
				// 		}, true);
				// 	}
				//
				// 	// if (!heightWatched) {
				// 	// 	heightWatched = true;
				// 	// 	checkHeight();
				// 	// }
				//
				// });

				var oldHeight = elem.height();

				function checkHeight() {

					console.log('[masonryTile] checkHeight()');

					$timeout(function() {

						console.log('[masonryTile] height change, oldHeight: ' + oldHeight + ', newHeight: ' + elem.height());

						if (oldHeight !== elem.height()) {
							oldHeight = elem.height();
							scope.$emit('angular_masonry_directive_update');

						}

						checkHeight();

					}, 100);

				}

				scope.$on('$destroy', function() {
					if (removeBrick) {
						removeBrick();
					}
				});
			}
		};
	}]);
})();