(function () {
  'use strict';

  function rpCommentCommentsResourceService($resource) {
    return $resource('/api/comments/:subreddit/:article', {
      sort: 'confidence'
    });
  }

  angular.module('rpComment')
    .factory('rpCommentCommentsResourceService', [
      '$resource',
      rpCommentCommentsResourceService
    ]);
}());
