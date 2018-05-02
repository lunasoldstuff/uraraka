(function () {
  'use strict';

  function rpShareEmailResourceService($resource) {
    return $resource('/mail/share');
  }

  angular.module('rpShare')
    .factory('rpShareEmailResourceService', [
      '$resource',
      rpShareEmailResourceService
    ]);
}());
