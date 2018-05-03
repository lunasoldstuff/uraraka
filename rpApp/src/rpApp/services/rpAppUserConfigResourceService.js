(function () {
  'use strict';

  function rpAppUserConfigResourceService($resource) {
    return $resource('/auth/userConfig');
  }

  angular.module('rpApp')
    .factory('rpAppUserConfigResourceService', [
      '$resource',
      rpAppUserConfigResourceService
    ]);
}());
