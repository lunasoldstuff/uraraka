(function () {
  'use strict';

  function rpMessageComposeResourceService($resource) {
    return $resource('/api/uauth/compose');
  }
  angular.module('rpMessage')
    .factory('rpMessageComposeResourceService', [
      '$resource',
      rpMessageComposeResourceService
    ]);
}());
