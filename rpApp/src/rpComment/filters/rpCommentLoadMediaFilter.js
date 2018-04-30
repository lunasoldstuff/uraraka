(function () {
  'use strict';

  function rpCommentLoadMediaFilter() {
    return function (commentBody) {
      // console.log('[rpFilters rpCommentLoadMediaFilter] typeof commentBody: ' + typeof commentBody);
      // console.log('[rpFilters rpCommentLoadMediaFilter] commentBody: ' + JSON.stringify(commentBody));
      return commentBody.replace(/<a/g, '<a class="rp-comment-media"');
    };
  }

  angular.module('rpComment')
    .filter('rpCommentLoadMediaFilter', [rpCommentLoadMediaFilter]);
}());
