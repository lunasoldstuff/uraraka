(function () {
  'use strict';

  function rpMessageReadAllResourceService($resource) {
    return $resource('/api/uauth/read_all_messages');
  }

  angular.module('rpMessage')
    .factory('rpMessageReadAllResourceService', [
      '$resource',
      rpMessageReadAllResourceService
    ]);
}());
