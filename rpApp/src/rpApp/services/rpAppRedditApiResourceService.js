(function () {
  'use strict';

  function rpAppRedditApiResourceService($resource) {
    return $resource('/api/generic');
  }

  angular.module('rpApp')
    .factory('rpAppRedditApiResourceService', [
      '$resource',
      rpAppRedditApiResourceService
    ]);
}());
