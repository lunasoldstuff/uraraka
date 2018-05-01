(function () {
  'use strict';

  function rpMediaTwitterResourceService($resource) {
    return $resource('/twitter/status/:id');
  }

  angular.module('rpMedia')
    .factory('rpMediaTwitterResourceService', [
      '$resource',
      rpMediaTwitterResourceService
    ]);
}());
