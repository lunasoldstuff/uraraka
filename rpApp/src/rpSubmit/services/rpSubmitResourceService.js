(function () {
  'use strict';

  function rpSubmitResourceService($resource) {
    return $resource('/api/uauth/submit');
  }

  angular.module('rpSubmit')
    .factory('rpSubmitResourceService', [
      '$resource',
      rpSubmitResourceService
    ]);
}());
