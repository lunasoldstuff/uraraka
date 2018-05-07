(function () {
  'use strict';

  function rpRedditConfigResourceService($resource) {
    return $resource('/api/reddit/config');
  }

  angular.module('rpApp')
    .factory('rpRedditConfigResourceService', [
      '$resource',
      rpRedditConfigResourceService
    ]);
}());
