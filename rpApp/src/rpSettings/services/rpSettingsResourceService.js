(function () {
  'use strict';

  function rpSettingsResourceService($resource) {
    return $resource('/api/settings/settings');
  }

  angular.module('rpSettings')
    .factory('rpSettingsResourceService', [
      '$resource',
      rpSettingsResourceService
    ]);
}());
