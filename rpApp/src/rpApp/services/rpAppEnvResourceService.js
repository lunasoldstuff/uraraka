(function () {
  'use strict';

  function rpAppEnvResourceService($resource) {
    return $resource('/auth/env');
  }

  angular.module('rpApp')
    .factory('rpAppEnvResourceService', [
      '$resource',
      rpAppEnvResourceService
    ]);
}());
