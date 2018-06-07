(function () {
  'use strict';

  function rpCommentResourceService($resource) {
    return $resource('/api/uauth/comment');
  }

  angular.module('rpComment')
    .factory('rpCommentResourceService', [
      '$resource',
      rpCommentResourceService
    ]);
}());
