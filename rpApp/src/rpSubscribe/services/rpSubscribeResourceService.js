(function () {
  'use strict';

  function rpSubbscribeResourceService($resource) {
    return $resource('/api/uauth/subscribe');
  }

  angular.module('rpSubscribe')
    .factory('rpSubbscribeResourceService', [
      '$resource',
      rpSubbscribeResourceService
    ]);
}());
