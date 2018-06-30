(function () {
  'use strict';

  function rpAppInfiniteScroll($rootScope, debounce) {
    return {
      restrict: 'A',

      link: function (scope, element, attrs) {
        var scrollDiv = attrs.rpAppInfiniteScrollDiv; // div to inf scroll on
        var scrollDistance = attrs.rpAppInfiniteScrollDistance; // multiple of div length to trigger inf scroll

        var debouncedLoadMore = debounce(300, function () {
          // console.log(`[rpAppInfiniteScroll] scroll div height : ${angular.element(scrollDiv).outerHeight()}`);
          if (scope.noMorePosts === undefined || scope.noMorePosts === false) {
            if (angular.element(scrollDiv)
              .outerHeight() - element.scrollTop() <=
              element.outerHeight() * scrollDistance) {
              console.log('[rpAppInfiniteScroll] call loadMorePosts');
              // scope.morePosts();
              $rootScope.$emit('rp_more_posts');
            }
          }
        }, true);

        element.on('scroll', function () {
          debouncedLoadMore();
        });
        console.log('[rpAppInfiniteScroll] link()');
      }
    };
  }

  angular.module('rpApp')
    .directive('rpAppInfiniteScroll', ['$rootScope', 'debounce', rpAppInfiniteScroll]);
}());
