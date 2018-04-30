(function () {
  'use strict';

  function rpAppByIdResourceService($resource) {
    return $resource('/api/by_id/:name');
  }

  angular.module('rpApp')
    .factory('rpAppByIdResourceService', [
      '$resource',
      rpAppByIdResourceService
    ]);
}());
