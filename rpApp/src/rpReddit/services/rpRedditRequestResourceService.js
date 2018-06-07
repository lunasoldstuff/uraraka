(function () {
  'use strict';

  function rpRedditRequestResourceService($resource) {
    return $resource('/api/reddit/request');
  }

  angular.module('rpApp')
    .factory('rpRedditRequestResourceService', [
      '$resource',
      rpRedditRequestResourceService
    ]);
}());
