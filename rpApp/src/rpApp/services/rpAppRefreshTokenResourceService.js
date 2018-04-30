(function () {
  'use strict';

  function rpAppRefreshTokenResourceService($resource) {
    return $resource('/auth/token');
  }

  angular.module('rpApp')
    .factory('rpAppRefreshTokenResourceService', [
      '$resource',
      rpAppRefreshTokenResourceService
    ]);
}());
