(function () {
  'use strict';

  function rpEditResourceService($resource) {
    return $resource('/api/uauth/editusertext');
  }

  angular.module('rpEdit')
    .factory('rpEditResourceService', [
      '$resource',
      rpEditResourceService
    ]);
}());
