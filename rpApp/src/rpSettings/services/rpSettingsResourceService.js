(function () {
  'use strict';

  function rpSettingsResourceService($resource) {
    return $resource('/settingsapi');
  }

  angular.module('rpSettings')
    .factory('rpSettingsResourceService', [
      '$resource',
      rpSettingsResourceService
    ]);
}());
