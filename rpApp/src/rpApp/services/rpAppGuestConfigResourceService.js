(function () {
  'use strict';

  function rpAppGuestConfigResourceService($resource) {
    return $resource('/auth/guestConfig');
  }

  angular.module('rpApp')
    .factory('rpAppGuestConfigResourceService', [
      '$resource',
      rpAppGuestConfigResourceService
    ]);
}());
