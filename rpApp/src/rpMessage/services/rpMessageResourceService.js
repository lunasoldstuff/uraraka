(function () {
  'use strict';

  function rpMessageResourceService($resource) {
    return $resource('/api/uauth/message/:where', {
      after: 'none'
    });
  }

  angular.module('rpMessage')
    .factory('rpMessageResourceService', [
      '$resource',
      rpMessageResourceService
    ]);
}());
