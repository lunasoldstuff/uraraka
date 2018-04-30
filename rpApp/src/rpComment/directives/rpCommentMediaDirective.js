(function () {
  'use strict';

  function rpCommentMedia() {
    return {
      restrict: 'C',
      scope: {
        href: '@'
      },
      transclude: true,
      replace: true,
      templateUrl: 'rpComment/views/rpCommentMedia.html'

    };
  }

  angular.module('rpComment')
    .directive('rpCommentMedia', rpCommentMedia);
}());
