(function () {
  'use strict';

  function rpGildResourceService($resource) {
    return $resource('/api/uauth/gild');
  }

  angular.module('rpGild')
    .factory('rpGildResourceService', [
      '$resource',
      rpGildResourceService
    ]);
}());
