(function () {
  'use strict';

  function rpAppRedditApiResourceService($resource) {
    return $resource('/api/reddit/request');
  }

  angular.module('rpApp')
    .factory('rpAppRedditApiResourceService', [
      '$resource',
      rpAppRedditApiResourceService
    ]);
}());
