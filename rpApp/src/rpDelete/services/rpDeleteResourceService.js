(function () {
  'use strict';

  function rpDeleteResourceService($resource) {
    return $resource('/api/uauth/del/');
  }

  angular.module('rpDelete')
    .factory('rpDeleteResourceService', [
      '$resource',
      rpDeleteResourceService
    ]);
}());
