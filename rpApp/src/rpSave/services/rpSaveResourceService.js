(function () {
  'use strict';

  function rpSaveResourceService($resource) {
    return $resource('/api/uauth/save/');
  }

  angular.module('rpSave')
    .factory('rpSaveResourceService', [
      '$resource',
      rpSaveResourceService
    ]);
}());
