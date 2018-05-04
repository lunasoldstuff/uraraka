(function () {
  'use strict';

  function rpAppRedditConfigResourceService($resource) {
    return $resource('/api/reddit/config');
  }

  angular.module('rpApp')
    .factory('rpAppRedditConfigResourceService', [
      '$resource',
      rpAppRedditConfigResourceService
    ]);
}());
