'use strict';

(function () {
	'use strict';

	angular.module('rpApp').directive('rpAppInfiniteScroll', ['$rootScope', 'debounce', rpAppInfiniteScroll]);

	function rpAppInfiniteScroll($rootScope, debounce) {
		return {
			restrict: 'A',

			link: function link(scope, element, attrs) {
				console.log('[rpAppInfiniteScroll] link()');

				var scrollDiv = attrs.rpAppInfiniteScrollDiv; //div to inf scroll on
				var scrollDistance = attrs.rpAppInfiniteScrollDistance; //multiple of div length to trigger inf scroll


				var deregisterLoadMoreClick = $rootScope.$on('rp_load_more', function () {
					scope.loadMore();
				});

				var debouncedLoadMore = debounce(300, function () {
					if (scope.noMorePosts === undefined || scope.noMorePosts === false) {

						if (angular.element(scrollDiv).outerHeight() - element.scrollTop() <= element.outerHeight() * scrollDistance) {
							console.log('[rpAppInfiniteScroll] call loadMorePosts');
							scope.morePosts();
						}
					}
				}, true);

				element.on('scroll', function () {
					// requestAnimationFrame(debounce(loadMore(), 3000));
					// debounce(requestAnimationFrame(loadMore), 3000);
					debouncedLoadMore();
				});
			}
		};
	}
})();