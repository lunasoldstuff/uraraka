(function () {
  'use strict';

  function rpIdentityResourceService($resource) {
    return $resource('/api/uauth/me');
  }

  angular.module('rpIdentity')
    .factory('rpIdentityResourceService', [
      '$resource',
      rpIdentityResourceService
    ]);
}());
