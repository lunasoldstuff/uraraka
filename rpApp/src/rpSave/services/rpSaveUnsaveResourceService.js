(function () {
  'use strict';

  function rpSaveUnsaveResourceService($resource) {
    return $resource('/api/uauth/unsave/');
  }

  angular.module('rpSave')
    .factory('rpSaveUnsaveResourceService', [
      '$resource',
      rpSaveUnsaveResourceService
    ]);
}());
