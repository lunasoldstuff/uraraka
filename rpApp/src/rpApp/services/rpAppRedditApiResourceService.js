(function () {
  'use strict';

  function rpAppRedditApiResourceService($resource) {
    return $resource('/api/reddit');
  }

  angular.module('rpApp')
    .factory('rpAppRedditApiResourceService', [
      '$resource',
      rpAppRedditApiResourceService
    ]);
}());
