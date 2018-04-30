(function () {
  'use strict';

  function rpCommentMoreChildrenResourceService($resource) {
    return $resource('/api/morechildren', {
      sort: 'confidence'
    });
  }

  angular.module('rpComment')
    .factory('rpCommentMoreChildrenResourceService', [
      '$resource',
      rpCommentMoreChildrenResourceService
    ]);
}());
