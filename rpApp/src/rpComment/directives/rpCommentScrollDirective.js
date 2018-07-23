(function () {
  'use strict';

  function rpCommentScroll($rootScope, $timeout, debounce) {
    return {
      restrict: 'A',

      link: function (scope, element, attrs) {
        var scrollDiv = attrs.rpCommentScrollDiv;
        var contentDiv = attrs.rpCommentContentDiv;
        var scrollDistance = attrs.rpCommentScrollDistance;
        var addingComments = false;
        var addingCommentsTimeout;
        var stopWatchingHeight;
        var blockFirst = true;
        var debouncedLoadMore;
        var deregisterStartWatchingHeight;
        console.log('[rpCommentScroll] link()');

        // FIXME: will this listener be removed when page we leave comments page?
        angular.element(scrollDiv).on('scroll', function () {
          console.log('[rpCommentScroll] onScroll, ' + !addingComments + ', ' + scope.commentsScroll + ', ' + !scope.noMoreComments);

          if (scope.commentsScroll && !addingComments && !scope.noMoreComments) {
            debouncedLoadMore();
          }
        });

        debouncedLoadMore = debounce(500, function () {
          // console.log('[rpCommentScroll] loadMore(), !scope.noMoreComments: ' + !scope.noMoreComments);

          // do not trigger if we have all the comments
          if (scope.noMoreComments === false) {
            // trigger conditions
            console.log(`[rpCommentScroll] debouncedLoadMore(), contentDiv Height: ${angular.element(contentDiv).outerHeight()}`);
            console.log(`[rpCommentScroll] debouncedLoadMore(), scrollTop: ${element.scrollTop()}`);
            console.log(`[rpCommentScroll] debouncedLoadMore(), scrollDiv scrollTop: ${angular.element(scrollDiv).scrollTop()}`);
            console.log(`[rpCommentScroll] debouncedLoadMore(), element.outerHeight(): ${element.outerHeight()}`);
            if (
              // angular.element(contentDiv).outerHeight() - element.scrollTop() <=
              angular.element(contentDiv).outerHeight() - angular.element(scrollDiv).scrollTop() <=
              // element.outerHeight() * scrollDistance
              angular.element(scrollDiv).outerHeight() * scrollDistance
            ) {
              addingComments = true;
              // $rootScope.$emit('rp_more_comments');
              scope.moreComments();
            }
          }
        }, true);

        // watch the height of the element.
        // if the height changes set scope.addingComments has completed.

        function startWatcinghHeight() {
          stopWatchingHeight = scope.$watch(

            function () {
              return angular.element(contentDiv)
                .height();
            },
            function (newHeight, oldHeight) {
              console.log('[rpCommentScroll] height listener');

              // don't do anything if old or new hieght is 0....

              console.log('[rpCommentScroll] height change, newHeight: ' + newHeight + ', oldHeight: ' +
                oldHeight);

              if (blockFirst) { // block the first time this listener fires
                console.log('[rpCommentScroll] height listener, block first');
                blockFirst = false;
              } else { // otherwise do stuff
                console.log('[rpCommentScroll] height listener, stop watching height...');
                console.timeEnd('[rpArticleCtrl addComments]');

                stopWatchingHeight();


                if (angular.isDefined(addingCommentsTimeout)) {
                  console.log('[rpCommentScroll] cancel addingCommentsTimeout');
                  $timeout.cancel(addingCommentsTimeout);
                }

                addingCommentsTimeout = $timeout(function () {
                  console.log('[rpCommentScroll] addingCommentsTimeout');
                  addingComments = false;
                  blockFirst = true;
                  scope.enableCommentsScroll();
                  scope.hideProgress();
                  startWatcinghHeight();
                }, 500);
              }
            }
          );
        }

        deregisterStartWatchingHeight = $rootScope.$on('rp_start_watching_height', function () {
          startWatcinghHeight();
        });

        scope.$on('$destroy', function () {
          if (angular.isDefined(addingCommentsTimeout)) {
            $timeout.cancel(addingCommentsTimeout);
          }

          deregisterStartWatchingHeight();
        });
      }
    };
  }


  angular.module('rpComment')
    .directive('rpCommentScroll', [
      '$rootScope',
      '$timeout',
      'debounce',
      rpCommentScroll
    ]);
}());
