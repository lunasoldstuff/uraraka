(function () {
  'use strict';

  function rpMessageReadResourceService($resource) {
    return $resource('/api/uauth/read_message');
  }

  angular.module('rpApp')
    .factory('rpMessageReadResourceService', [
      '$resource',
      rpMessageReadResourceService
    ]);
}());
