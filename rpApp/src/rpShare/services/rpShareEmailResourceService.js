(function () {
  'use strict';

  function rpShareEmailResourceService($resource) {
    return $resource('/api/mail/share');
  }

  angular.module('rpShare')
    .factory('rpShareEmailResourceService', [
      '$resource',
      rpShareEmailResourceService
    ]);
}());
